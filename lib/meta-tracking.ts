// Meta Pixel tracking utilities for ShieldSeller
// Use these functions to track conversions for Facebook/Instagram ads

declare global {
  interface Window {
    fbq: any;
  }
}

// Track when someone signs up / starts free trial
export function trackMetaLead(method?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Free Trial Signup',
      content_category: 'Registration',
      method: method || 'unknown',
    });
    console.log('✅ Meta Lead tracked:', method);
  }
}

// Track when someone completes registration
export function trackMetaCompleteRegistration(method?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'ShieldSeller Registration',
      method: method || 'unknown',
    });
    console.log('✅ Meta CompleteRegistration tracked:', method);
  }
}

// Track when someone initiates checkout
export function trackMetaInitiateCheckout(plan: string, value: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: plan,
      content_category: 'Subscription',
      value: value,
      currency: 'USD',
    });
    console.log('✅ Meta InitiateCheckout tracked:', plan, value);
  }
}

// Track successful purchase/subscription
export function trackMetaPurchase(plan: string, value: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: plan,
      content_category: 'Subscription',
      value: value,
      currency: 'USD',
    });
    console.log('✅ Meta Purchase tracked:', plan, value);
  }
}

// Track when someone views pricing/content
export function trackMetaViewContent(contentName: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
    });
    console.log('✅ Meta ViewContent tracked:', contentName);
  }
}

// Track button clicks / CTA interactions
export function trackMetaButtonClick(buttonName: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ButtonClick', {
      button_name: buttonName,
    });
    console.log('✅ Meta ButtonClick tracked:', buttonName);
  }
}

// Track contact/support requests
export function trackMetaContact() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact');
    console.log('✅ Meta Contact tracked');
  }
}