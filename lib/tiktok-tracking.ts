// TikTok Pixel Conversion Tracking Utility
// Use these functions to track user actions for ad optimization

declare global {
  interface Window {
    ttq: {
      track: (event: string, params?: Record<string, any>) => void;
      identify: (params: Record<string, any>) => void;
      page: () => void;
    };
  }
}

// Check if TikTok Pixel is loaded
const isTTQAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.ttq !== undefined;
};

// Track user registration/sign-up
export const trackSignUp = (method?: string) => {
  if (isTTQAvailable()) {
    window.ttq.track('CompleteRegistration', {
      content_name: 'ShieldSeller Sign Up',
      status: 'success',
      method: method || 'email',
    });
  }
};

// Track subscription purchase
export const trackSubscription = (plan: string, value: number) => {
  if (isTTQAvailable()) {
    window.ttq.track('CompletePayment', {
      content_name: `ShieldSeller ${plan} Plan`,
      content_type: 'subscription',
      value: value,
      currency: 'USD',
    });
  }
};

// Track when user starts checkout
export const trackInitiateCheckout = (plan: string, value: number) => {
  if (isTTQAvailable()) {
    window.ttq.track('InitiateCheckout', {
      content_name: `ShieldSeller ${plan} Plan`,
      content_type: 'subscription',
      value: value,
      currency: 'USD',
    });
  }
};

// Track when user views pricing/plans
export const trackViewContent = (contentName: string) => {
  if (isTTQAvailable()) {
    window.ttq.track('ViewContent', {
      content_name: contentName,
    });
  }
};

// Track form submissions (contact, etc.)
export const trackFormSubmit = (formName: string) => {
  if (isTTQAvailable()) {
    window.ttq.track('SubmitForm', {
      content_name: formName,
    });
  }
};

// Track button clicks (CTA buttons)
export const trackButtonClick = (buttonName: string) => {
  if (isTTQAvailable()) {
    window.ttq.track('ClickButton', {
      content_name: buttonName,
    });
  }
};

// Track free trial start
export const trackStartTrial = () => {
  if (isTTQAvailable()) {
    window.ttq.track('StartTrial', {
      content_name: 'ShieldSeller Free Trial',
    });
  }
};

// Track product scan/analysis
export const trackProductScan = (scanCount: number) => {
  if (isTTQAvailable()) {
    window.ttq.track('Search', {
      content_name: 'Product Scan',
      query: `${scanCount} products scanned`,
    });
  }
};

export default {
  trackSignUp,
  trackSubscription,
  trackInitiateCheckout,
  trackViewContent,
  trackFormSubmit,
  trackButtonClick,
  trackStartTrial,
  trackProductScan,
};