import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ShieldSeller',
  description: 'ShieldSeller Privacy Policy - How we collect and protect your data',
};

export default function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated: December 2025</strong></p>

          <h2>1. Information We Collect</h2>
          <h3>Information You Provide Directly</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, business information</li>
            <li><strong>Payment Information:</strong> Billing name, address, and payment method (processed securely by Stripe)</li>
            <li><strong>Service Data:</strong> TikTok Shop listings and product data you choose to analyze</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
            <li><strong>Cookies & Tracking:</strong> Session cookies and analytics tracking</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use collected information for:</p>
          <ul>
            <li>Providing and improving the ShieldSeller Service</li>
            <li>Processing payments and managing subscriptions</li>
            <li>Sending service notifications and support communications</li>
            <li>Analyzing platform usage and performance</li>
            <li>Detecting and preventing fraud or policy violations</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>3. Data Sharing & Disclosure</h2>
          <p><strong>We do NOT sell or rent your personal information.</strong></p>
          <p>We may share data with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Stripe (payments), Vercel (hosting), SendGrid (email)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Your Authorization:</strong> When you explicitly permit sharing</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>SSL/TLS encryption for data in transit</li>
            <li>Secure password hashing and authentication</li>
            <li>Regular security audits and monitoring</li>
            <li>Restricted access to personal information</li>
          </ul>

          <h2>5. Data Retention</h2>
          <ul>
            <li><strong>Active Account Data:</strong> Retained while you maintain a subscription</li>
            <li><strong>Payment Records:</strong> Retained per financial compliance (7 years)</li>
            <li><strong>Usage Logs:</strong> Retained for 12 months</li>
            <li><strong>Deleted Accounts:</strong> Personal data deleted within 30 days of account closure</li>
          </ul>

          <h2>6. Your Rights & Choices</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <p>To exercise these rights, contact: <strong>support@shieldseller.com</strong></p>

          <h2>7. Contact Us</h2>
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