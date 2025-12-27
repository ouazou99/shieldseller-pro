import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeListingRisk, ListingData } from '@/lib/sps-rules';
import { parseCSV } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { shopId, csvData } = body;

    if (!shopId || !csvData) {
      return NextResponse.json(
        { error: 'Shop ID and CSV data are required' },
        { status: 400 }
      );
    }

    // Verify shop ownership
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        userId: session.user.id,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      );
    }

    // Parse CSV
    const rows = parseCSV(csvData);
    
    if (rows.length < 2) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Get headers
    const headers = rows[0].map(h => h.toLowerCase().trim());
    
    // Required columns
    const requiredColumns = ['product_id', 'title', 'description'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }

    // Process each row
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      if (row.length === 0 || !row.some(cell => cell.trim())) {
        continue; // Skip empty rows
      }

      try {
        // Extract data from row
        const getData = (columnName: string): string => {
          const index = headers.indexOf(columnName);
          return index !== -1 ? row[index]?.trim() || '' : '';
        };

        const productId = getData('product_id');
        const title = getData('title');
        const description = getData('description');

        if (!productId || !title || !description) {
          failed++;
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Prepare listing data for analysis
        const listingData: ListingData = {
          productId,
          title,
          description,
          category: getData('category') || undefined,
          price: getData('price') ? parseFloat(getData('price')) : undefined,
          imageUrl: getData('image_url') || undefined,
          views: getData('views') ? parseInt(getData('views')) : undefined,
          orders: getData('orders') ? parseInt(getData('orders')) : undefined,
          returnRate: getData('return_rate') ? parseFloat(getData('return_rate')) : undefined,
          rating: getData('rating') ? parseFloat(getData('rating')) : undefined,
          reviewCount: getData('review_count') ? parseInt(getData('review_count')) : undefined,
          shippingDays: getData('shipping_days') ? parseInt(getData('shipping_days')) : undefined,
          lateShipmentRate: getData('late_shipment_rate') ? parseFloat(getData('late_shipment_rate')) : undefined,
        };

        // Run risk analysis
        const analysis = analyzeListingRisk(listingData);

        // Check if listing already exists
        const existingListing = await prisma.listing.findUnique({
          where: {
            shopId_productId: {
              shopId,
              productId,
            },
          },
        });

        if (existingListing) {
          // Update existing listing
          await prisma.listing.update({
            where: { id: existingListing.id },
            data: {
              title,
              description,
              category: listingData.category,
              price: listingData.price,
              imageUrl: listingData.imageUrl,
              views: listingData.views || 0,
              orders: listingData.orders || 0,
              returnRate: listingData.returnRate || 0,
              rating: listingData.rating || 0,
              reviewCount: listingData.reviewCount || 0,
              riskScore: analysis.riskScore,
              riskLevel: analysis.riskLevel,
              lastScannedAt: new Date(),
            },
          });

          // Delete old violations
          await prisma.violation.deleteMany({
            where: { listingId: existingListing.id },
          });

          // Create new violations
          if (analysis.violations.length > 0) {
            await prisma.violation.createMany({
              data: analysis.violations.map(v => ({
                listingId: existingListing.id,
                type: v.type,
                severity: v.severity,
                title: v.title,
                description: v.description,
                suggestion: v.suggestion,
              })),
            });
          }
        } else {
          // Create new listing
          const listing = await prisma.listing.create({
            data: {
              shopId,
              productId,
              title,
              description,
              category: listingData.category,
              price: listingData.price,
              imageUrl: listingData.imageUrl,
              views: listingData.views || 0,
              orders: listingData.orders || 0,
              returnRate: listingData.returnRate || 0,
              rating: listingData.rating || 0,
              reviewCount: listingData.reviewCount || 0,
              riskScore: analysis.riskScore,
              riskLevel: analysis.riskLevel,
              lastScannedAt: new Date(),
              status: analysis.riskLevel === 'critical' ? 'flagged' : 'active',
            },
          });

          // Create violations
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
          }
        }

        successful++;
      } catch (error) {
        failed++;
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update shop metrics
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
        totalProducts: allListings.length,
        riskScore: avgRiskScore,
        lastScannedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        total: rows.length - 1,
        successful,
        failed,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}
