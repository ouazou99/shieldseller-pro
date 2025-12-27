import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeListingRisk } from '@/lib/sps-rules';
import { sendEmail, emailTemplates } from '@/lib/email';

// This endpoint should be called by a CRON service (Vercel Cron, GitHub Actions, etc.)
// Add this to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/daily-scan",
//     "schedule": "0 9 * * *"
//   }]
// }

export async function GET(req: Request) {
  try {
    // Verify CRON secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting daily scan...');

    // Get all active shops
    const shops = await prisma.shop.findMany({
      where: { status: 'active' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        listings: true,
      },
    });

    let totalScanned = 0;
    let totalViolations = 0;
    let emailsSent = 0;

    for (const shop of shops) {
      let shopViolations = 0;
      let shopHighRisk = 0;

      // Scan each listing
      for (const listing of shop.listings) {
        const listingData = {
          productId: listing.productId,
          title: listing.title,
          description: listing.description,
          category: listing.category || undefined,
          price: listing.price || undefined,
          views: listing.views,
          orders: listing.orders,
          returnRate: listing.returnRate,
          rating: listing.rating,
          reviewCount: listing.reviewCount || undefined,
        };

        const analysis = analyzeListingRisk(listingData);

        // Update listing
        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            riskScore: analysis.riskScore,
            riskLevel: analysis.riskLevel,
            lastScannedAt: new Date(),
          },
        });

        // Count violations
        if (analysis.violations.length > 0) {
          shopViolations += analysis.violations.length;
          
          // Delete old violations
          await prisma.violation.deleteMany({
            where: { listingId: listing.id },
          });

          // Create new violations
          await prisma.violation.createMany({
            data: analysis.violations.map(v => ({
              listingId: listing.id,
              type: v.type,
              severity: v.severity,
              title: v.title,
              description: v.description,
              suggestion: v.suggestion,
            })),
          });

          // Create alert for critical violations
          if (analysis.violations.some(v => v.severity === 'critical')) {
            await prisma.alert.create({
              data: {
                userId: shop.userId,
                shopId: shop.id,
                type: 'violation',
                severity: 'critical',
                message: `Critical violation detected in "${listing.title}"`,
                sentEmail: false,
              },
            });
          }
        }

        if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
          shopHighRisk++;
        }

        totalScanned++;
      }

      totalViolations += shopViolations;

      // Update shop risk score
      const avgRiskScore = shop.listings.length > 0
        ? shop.listings.reduce((sum, l) => sum + l.riskScore, 0) / shop.listings.length
        : 0;

      await prisma.shop.update({
        where: { id: shop.id },
        data: {
          riskScore: avgRiskScore,
          lastScannedAt: new Date(),
        },
      });

      // Send daily report email
      if (shop.user.email) {
        const emailData = emailTemplates.dailyReport(
          shop.user.name || 'there',
          {
            shopName: shop.shopName,
            riskScore: Math.round(avgRiskScore),
            violations: shopViolations,
            listings: shop.listings.length,
            highRisk: shopHighRisk,
          },
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        );

        const result = await sendEmail({
          to: shop.user.email,
          subject: emailData.subject,
          html: emailData.html,
        });

        if (result.success) {
          emailsSent++;
        }
      }
    }

    // Create scan record
    await prisma.riskScan.createMany({
      data: shops.map(shop => ({
        shopId: shop.id,
        riskScore: shop.riskScore,
        totalListings: shop.listings.length,
        violationCount: shop.listings.reduce((sum, l) => sum + l.violations.length, 0),
      })),
    });

    console.log(`✅ Daily scan complete: ${totalScanned} listings, ${totalViolations} violations, ${emailsSent} emails sent`);

    return NextResponse.json({
      success: true,
      stats: {
        shopsScanned: shops.length,
        listingsScanned: totalScanned,
        violationsFound: totalViolations,
        emailsSent,
      },
    });
  } catch (error) {
    console.error('Daily scan error:', error);
    return NextResponse.json(
      { error: 'Daily scan failed', details: error },
      { status: 500 }
    );
  }
}
