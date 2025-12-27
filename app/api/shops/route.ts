import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addShopSchema = z.object({
  shopName: z.string().min(2, 'Shop name must be at least 2 characters'),
  shopId: z.string().min(1, 'Shop ID is required'),
  platform: z.enum(['tiktok', 'amazon', 'shopify', 'walmart']),
  shopUrl: z.string().optional(),
});

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
    
    // Validate input
    const validation = addShopSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { shopName, shopId, platform, shopUrl } = validation.data;

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const existingShops = await prisma.shop.count({
      where: { userId: session.user.id },
    });

    if (existingShops >= (subscription?.shopsLimit || 1)) {
      return NextResponse.json(
        { error: 'Shop limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Check if shop already exists
    const existingShop = await prisma.shop.findUnique({
      where: {
        userId_shopId_platform: {
          userId: session.user.id,
          shopId,
          platform,
        },
      },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: 'This shop is already connected' },
        { status: 400 }
      );
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        userId: session.user.id,
        shopName,
        shopId,
        platform,
        shopUrl: shopUrl || null,
        totalProducts: 0,
        riskScore: 0,
        status: 'active',
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        shop,
        message: 'Shop added successfully!' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add shop error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const shops = await prisma.shop.findMany({
      where: { userId: session.user.id },
      include: {
        listings: {
          select: {
            id: true,
            riskScore: true,
            riskLevel: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Get shops error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}
