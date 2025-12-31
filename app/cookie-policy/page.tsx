import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | ShieldSeller',
  description: 'ShieldSeller Cookie Policy - How we use cookies and tracking',
};

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <h1>Cookie Policy</h1>
          <p><strong>Last Updated: December 2025</strong></p>

          <h2>1. What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device (computer, smartphone, tablet) when you visit a website. They serve several functions, including:</p>
          <ul>
            <li>Remembering your login information</li>
            <li>Saving your preferences</li>
            <li>Tracking site usage and analytics</li>
            <li>Enabling security features</li>
            <li>Personalizing your experience</li>
          </ul>

          <h2>2. Types of Cookies We Use</h2>
          <h3>Essential Cookies (Required)</h3>
          <p>These cookies are necessary for the Service to function. They cannot be disabled:</p>
          <ul>
            <li><strong>sessionId:</strong> User authentication and session management</li>
            <li><strong>csrf_token:</strong> Security protection against cross-site attacks</li>
            <li><strong>stripe_session:</strong> Secure payment processing during checkout</li>
          </ul>

          <h3>Analytics Cookies (Optional)</h3>
          <p>These help us understand how visitors use ShieldSeller to improve performance:</p>
          <ul>
            <li><strong>_ga, _gid, _gat:</strong> Google Analytics for tracking usage</li>
          </ul>

          <h3>Marketing Cookies (Optional)</h3>
          <p>These enable targeted advertising and retargeting on third-party platforms:</p>
          <ul>
            <li><strong>fbp:</strong> Facebook Pixel for conversion tracking</li>
            <li><strong>ttq:</strong> TikTok Pixel for conversion tracking</li>
          </ul>

          <h2>3. How We Use Cookies</h2>
          <ul>
            <li><strong>Service Functionality:</strong> Maintaining your login session, storing preferences</li>
            <li><strong>Analytics:</strong> Analyzing how you interact with ShieldSeller</li>
            <li><strong>Marketing:</strong> Measuring ad campaign effectiveness and retargeting</li>
            <li><strong>Security:</strong> Protecting against fraud and security threats</li>
          </ul>

          <h2>4. Your Cookie Choices</h2>
          <h3>Browser Settings</h3>
          <p>You can control cookies through your browser settings:</p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          </ul>

          <h3>Opt-Out Tools</h3>
          <ul>
            <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Opt-out</a></li>
            <li><strong>Facebook:</strong> <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer">Ads Preferences</a></li>
            <li><strong>Your Online Choices:</strong> <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">Visit Site</a></li>
          </ul>

          <h2>5. Third-Party Services</h2>
          <p>ShieldSeller integrates with these services that may set cookies:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Website usage tracking</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Facebook Pixel:</strong> Conversion tracking</li>
            <li><strong>TikTok Pixel:</strong> Conversion tracking</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>
            📧 Privacy: <a href="mailto:privacy@shieldseller.com">privacy@shieldseller.com</a><br />
            📧 Support: <a href="mailto:support@shieldseller.com">support@shieldseller.com</a>
          </p>
        </article>

        {/* Footer Link */}
        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}