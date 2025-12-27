import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateListingFix, generateSimpleFix } from "@/lib/ai-fix"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const listingId = params.id

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
          where: { status: "open" },
        },
        shop: true,
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // Check subscription limits for AI fixes
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription || subscription.aiRewritesLimit <= 0) {
      return NextResponse.json(
        { error: "AI rewrites limit reached. Please upgrade your plan." },
        { status: 403 }
      )
    }

    // Generate fix (AI if key exists, otherwise simple)
    const fixResult = process.env.ANTHROPIC_API_KEY
      ? await generateListingFix({
          title: listing.title,
          description: listing.description,
          violations: listing.violations.map((v) => ({
            type: v.type,
            title: v.title,
            description: v.description,
          })),
        })
      : await generateSimpleFix({
          title: listing.title,
          description: listing.description,
          violations: listing.violations.map((v) => ({
            type: v.type,
            title: v.title,
            description: v.description,
          })),
        })

    // Handle failure safely (works even if error field is not always present)
    if (!fixResult.success) {
      const err =
        "error" in fixResult && typeof (fixResult as any).error === "string"
          ? (fixResult as any).error
          : "Failed to generate fix"

      return NextResponse.json({ error: err }, { status: 500 })
    }

    // Some success shapes may not include isSimpleFix, so guard it
    const isSimpleFix =
      "isSimpleFix" in fixResult ? Boolean((fixResult as any).isSimpleFix) : false

    const remainingRewrites = isSimpleFix
      ? subscription.aiRewritesLimit
      : Math.max(0, subscription.aiRewritesLimit - 1)

    // Decrement AI rewrites count (only for AI-powered fixes)
    if (!isSimpleFix) {
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { aiRewritesLimit: remainingRewrites },
      })
    }

    return NextResponse.json({
      success: true,
      original: (fixResult as any).original,
      fixed: (fixResult as any).fixed,
      changes: (fixResult as any).changes,
      isSimpleFix,
      remainingRewrites,
    })
  } catch (error) {
    console.error("Fix listing error:", error)
    return NextResponse.json({ error: "Failed to generate fix" }, { status: 500 })
  }
}
