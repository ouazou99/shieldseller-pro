import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Shield } from 'lucide-react';
import PricingCard from '@/components/PricingCard';

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  
  let currentPlan = 'free';
  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    currentPlan = subscription?.plan || 'free';
  }

  const plans = [
    {
      name: 'Starter',
      price: 19,
      priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
      features: [
        '1 TikTok Shop',
        'Daily risk scans',
        'Email alerts',
        'Basic violation detection',
        '10 AI rewrites/month',
        '7-day free trial',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: 49,
      priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
      features: [
        '3 TikTok Shops',
        'Real-time monitoring',
        '50 AI rewrites/month',
        'SMS + Email alerts',
        'Export reports',
        'Priority support',
        '7-day free trial',
      ],
      popular: true,
    },
    {
      name: 'Agency',
      price: 149,
      priceId: process.env.STRIPE_AGENCY_PRICE_ID || 'price_agency',
      features: [
        '10+ TikTok Shops',
        'Team collaboration',
        '200 AI rewrites/month',
        'White-label reports',
        'API access',
        'Dedicated account manager',
        '7-day free trial',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-brand-600" />
              <span className="text-2xl font-bold text-gray-900">ShieldSeller</span>
            </Link>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link href="/dashboard">
                  <Button size="sm">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Get Started Free</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your business. All plans include 7-day free trial.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              currentPlan={currentPlan}
              isLoggedIn={!!session}
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <FAQ
            question="Can I cancel anytime?"
            answer="Yes! You can cancel your subscription at any time. No questions asked, no cancellation fees."
          />
          <FAQ
            question="What payment methods do you accept?"
            answer="We accept all major credit cards (Visa, Mastercard, American Express) through Stripe."
          />
          <FAQ
            question="Do you offer refunds?"
            answer="If you're not satisfied within the first 7 days, contact us for a full refund."
          />
          <FAQ
            question="Can I upgrade or downgrade my plan?"
            answer="Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing period."
          />
        </div>
      </section>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}