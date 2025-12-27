import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateListingFix, generateSimpleFix } from '@/lib/ai-fix';

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

    const listingId = params.id;

    // Get listing with violations
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        shop: {
          userId: session.user.id,
        },
      },
      include: {
        violations: {
          where: { status: 'open' },
        },
        shop: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check subscription limits for AI fixes
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription || subscription.aiRewritesLimit <= 0) {
      return NextResponse.json(
        { error: 'AI rewrites limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate AI fix
    const fixResult = process.env.ANTHROPIC_API_KEY
      ? await generateListingFix({
          title: listing.title,
          description: listing.description,
          violations: listing.violations.map(v => ({
            type: v.type,
            title: v.title,
            description: v.description,
          })),
        })
      : generateSimpleFix({
          title: listing.title,
          description: listing.description,
          violations: listing.violations.map(v => ({
            type: v.type,
            title: v.title,
            description: v.description,
          })),
        });

    if (!fixResult.success) {
      return NextResponse.json(
        { error: fixResult.error || 'Failed to generate fix' },
        { status: 500 }
      );
    }

    // Decrement AI rewrites count (only for AI-powered fixes)
    if (!fixResult.isSimpleFix) {
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          aiRewritesLimit: Math.max(0, subscription.aiRewritesLimit - 1),
        },
      });
    }

    if (!fixResult.success) {
  return NextResponse.json(
    { error: fixResult.error || 'Failed to generate fix' },
    { status: 500 }
  );
}

return NextResponse.json({
  success: true,
  original: fixResult.original,
  fixed: fixResult.fixed,
  changes: fixResult.changes,
  isSimpleFix: fixResult.isSimpleFix,
  remainingRewrites: fixResult.isSimpleFix 
    ? subscription.aiRewritesLimit 
    : subscription.aiRewritesLimit - 1,
});
  } catch (error) {
    console.error('Fix listing error:', error);
    return NextResponse.json(
      { error: 'Failed to generate fix' },
      { status: 500 }
    );
  }
}
