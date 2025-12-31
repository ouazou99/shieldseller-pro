import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | ShieldSeller',
  description: 'ShieldSeller Terms of Service - Legal terms for using our platform',
};

export default function TermsOfService() {
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
          <h1>Terms of Service</h1>
          <p><strong>Last Updated: December 2025</strong></p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using ShieldSeller, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you may not use the Service. We reserve the right to modify these Terms at any time. Continued use of the Service constitutes acceptance of modified Terms.</p>

          <h2>2. Service Description</h2>
          <p>ShieldSeller provides a SaaS platform that helps TikTok Shop sellers:</p>
          <ul>
            <li>Analyze product listings against TikTok policy guidelines</li>
            <li>Identify potential policy violations using an AI-powered risk scoring engine</li>
            <li>Receive suggestions for fixing violations</li>
            <li>Monitor listings for compliance on an ongoing basis</li>
          </ul>
          <p><strong>Important:</strong> ShieldSeller is a third-party service and is not affiliated with TikTok/ByteDance. Compliance with our recommendations does not guarantee TikTok Shop approval or account protection.</p>

          <h2>3. User Eligibility</h2>
          <p>You must be:</p>
          <ul>
            <li>At least 18 years old</li>
            <li>A legal TikTok Shop seller or authorized representative</li>
            <li>Acting in compliance with TikTok Shop's Terms of Service and local laws</li>
          </ul>

          <h2>4. User Accounts</h2>
          <h3>Registration</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration.</p>

          <h3>Account Responsibility</h3>
          <p>You are solely responsible for all activities on your account. ShieldSeller is not liable for unauthorized access resulting from your negligence.</p>

          <h3>Termination</h3>
          <p>We may terminate or suspend your account at any time if you violate these Terms, engage in fraudulent activity, or pose a risk to the Service's security.</p>

          <h2>5. Acceptable Use Policy</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use ShieldSeller to violate any laws or regulations</li>
            <li>Upload content that is illegal, defamatory, obscene, or infringing</li>
            <li>Attempt to reverse-engineer, hack, or compromise Service security</li>
            <li>Scrape, automate, or extract data beyond permitted API usage</li>
            <li>Use the Service to operate competing platforms</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Transmit viruses, malware, or harmful code</li>
            <li>Create multiple accounts to evade restrictions or pricing</li>
          </ul>

          <h2>6. Pricing & Billing</h2>
          <h3>Subscription Plans</h3>
          <p>ShieldSeller offers tiered subscription plans with features and limits detailed on our pricing page.</p>

          <h3>Payment Terms</h3>
          <ul>
            <li>Billing occurs automatically on your chosen interval (monthly/annual)</li>
            <li>You authorize ShieldSeller to charge your payment method</li>
            <li>Prices may change with 30 days' notice</li>
            <li>Taxes (where applicable) are added to your billing</li>
          </ul>

          <h2>7. Refund & Cancellation Policy</h2>
          <p>See our separate <Link href="/refund-policy" className="text-blue-600 hover:text-blue-800">Refund & Cancellation Policy</Link> for complete details.</p>

          <h2>8. Limitation of Liability</h2>
          <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong></p>
          <p>ShieldSeller is provided "AS IS" without warranties of any kind, including merchantability, fitness for a particular purpose, or non-infringement.</p>
          <p><strong>We are not liable for:</strong></p>
          <ul>
            <li>Account suspensions from TikTok Shop</li>
            <li>Revenue loss or business interruption</li>
            <li>Indirect, incidental, consequential, or punitive damages</li>
            <li>Failure to prevent policy violations or account issues</li>
            <li>Third-party actions or TikTok Shop decisions</li>
          </ul>
          <p><strong>Your sole remedy</strong> for dissatisfaction is cancellation and refund (if applicable).</p>

          <h2>9. Contact Us</h2>
          <p>
            For questions about these Terms:<br />
            📧 Email: <a href="mailto:legal@shieldseller.com">legal@shieldseller.com</a><br />
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