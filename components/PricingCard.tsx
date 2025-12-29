'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  priceId: string;
  features: string[];
  popular: boolean;
}

interface PricingCardProps {
  plan: Plan;
  currentPlan: string;
  isLoggedIn: boolean;
}

export default function PricingCard({ plan, currentPlan, isLoggedIn }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const isCurrent = plan.name.toLowerCase() === currentPlan;

  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setIsLoading(false);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 ${
        plan.popular ? 'ring-2 ring-brand-600 relative' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-600 ml-2">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      ) : isLoggedIn ? (
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          variant={plan.popular ? 'primary' : 'outline'}
          className="w-full"
        >
          {isLoading ? 'Loading...' : `Upgrade to ${plan.name}`}
        </Button>
      ) : (
        <Button
          onClick={() => router.push('/register')}
          variant={plan.popular ? 'primary' : 'outline'}
          className="w-full"
        >
          Start Free Trial
        </Button>
      )}
    </div>
  );
}