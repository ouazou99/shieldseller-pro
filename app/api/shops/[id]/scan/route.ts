import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeListingRisk } from '@/lib/sps-rules';

// POST /api/shops/[id]/scan - Rescan all listings in a shop
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const shopId = params.id;

    // Verify shop ownership
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        userId: session.user.id,
      },
      include: {
        listings: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    let scannedCount = 0;
    let totalViolations = 0;

    // Rescan each listing
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

      // Delete old violations
      await prisma.violation.deleteMany({
        where: { listingId: listing.id },
      });

      // Create new violations
      if (analysis.violations.length > 0) {
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
        totalViolations += analysis.violations.length;
      }

      scannedCount++;
    }

    // Update shop risk score
    const allListings = await prisma.listing.findMany({
      where: { shopId },
      select: { riskScore: true },
    });

    const avgRiskScore = allListings.length > 0
      ? allListings.reduce((sum, l) => sum + l.riskScore, 0) / allListings.length
      : 0;

    await prisma.shop.update({
      where: { id: shopId },
      data: {
        riskScore: avgRiskScore,
        lastScannedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      scannedCount,
      totalViolations,
      avgRiskScore: Math.round(avgRiskScore),
      message: `Successfully rescanned ${scannedCount} listings`,
    });
  } catch (error) {
    console.error('Shop rescan error:', error);
    return NextResponse.json(
      { error: 'Failed to rescan shop' },
      { status: 500 }
    );
  }
}
