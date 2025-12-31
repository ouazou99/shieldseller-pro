'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [purchaseTracked, setPurchaseTracked] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && !purchaseTracked && typeof window !== 'undefined' && window.ttq) {
      const trackPurchase = async () => {
        try {
          const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);
          const data = await response.json();

          if (data.amount && data.success) {
            const amount = data.amount / 100;
            
            window.ttq.track('Purchase', {
              value: amount,
              currency: 'USD',
            });

            console.log(`✅ TikTok Purchase tracked: $${amount} USD`);
            setPurchaseTracked(true);
          } else if (data.amount) {
            const amount = data.amount / 100;
            window.ttq.track('Purchase', {
              value: amount,
              currency: 'USD',
            });
            setPurchaseTracked(true);
          }
        } catch (error) {
          console.error('Failed to fetch checkout session:', error);
          window.ttq.track('Purchase', {
            value: 0,
            currency: 'USD',
          });
          setPurchaseTracked(true);
        }
      };

      trackPurchase();
    }
  }, [searchParams, purchaseTracked]);

  return <>{children}</>;
}