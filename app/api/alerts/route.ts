import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/alerts - Get user's alerts
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get("unread") === "true"

    const where: any = { userId: session.user.id }
    if (unreadOnly) {
      where.read = false
    }

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        shop: {
          select: {
            shopName: true,
            platform: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Get alerts error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

// POST /api/alerts - Create new alert
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { shopId, type, severity, message, sendEmail, title } = body

    const finalTitle =
      title ?? `${severity ?? "Alert"}: ${type ?? "Notification"}`

    const alert = await prisma.alert.create({
      data: {
        title: finalTitle,
        userId: session.user.id,
        shopId: shopId || null,
        type,
        severity,
        message,
        sentEmail: Boolean(sendEmail),
      },
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    console.error("Create alert error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

// PATCH /api/alerts/[id] - Mark alert as read
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { alertId, read } = body

    // Verify alert ownership
    const alert = await prisma.alert.findFirst({
      where: {
        id: alertId,
        userId: session.user.id,
      },
    })

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: { read },
    })

    return NextResponse.json({ alert: updatedAlert })
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}

// DELETE /api/alerts - Mark all as read
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.alert.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark all read error:", error)
    return NextResponse.json(
      { error: "Failed to mark alerts as read" },
      { status: 500 }
    )
  }
}
