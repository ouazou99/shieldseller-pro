import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) {
    console.error('No userId in checkout session');
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        status: 'active',
      },
    });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Determine plan from price
  let plan = 'starter';
  let shopsLimit = 1;
  let scansPerDay = 1;
  let aiRewritesLimit = 10;

  const priceId = subscription.items.data[0].price.id;

  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    plan = 'pro';
    shopsLimit = 3;
    scansPerDay = 10;
    aiRewritesLimit = 50;
  } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
    plan = 'agency';
    shopsLimit = 10;
    scansPerDay = 100;
    aiRewritesLimit = 200;
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      status: 'active',
      shopsLimit,
      scansPerDay,
      aiRewritesLimit,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      plan,
      stripeSubscriptionId: subscription.id,
      status: 'active',
      shopsLimit,
      scansPerDay,
      aiRewritesLimit,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionUpdated(subscription: any) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
      plan: 'free',
      shopsLimit: 1,
      scansPerDay: 1,
      aiRewritesLimit: 0,
    },
  });
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('Payment succeeded:', invoice.id);
  // Optional: Send payment confirmation email
}

async function handlePaymentFailed(invoice: any) {
  console.log('Payment failed:', invoice.id);
  
  // Update subscription status
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: invoice.subscription },
      data: { status: 'past_due' },
    });
  }
  
  // Optional: Send payment failed email
}
