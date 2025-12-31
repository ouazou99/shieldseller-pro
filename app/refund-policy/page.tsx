import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy | ShieldSeller',
  description: 'ShieldSeller refund and cancellation policy for subscriptions',
};

export default function RefundPolicy() {
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
          <h1>Refund & Cancellation Policy</h1>
          <p><strong>Last Updated: December 2025</strong></p>

          <h2>1. Cancellation</h2>
          <h3>How to Cancel</h3>
          <p>You can cancel your subscription anytime in your account settings:</p>
          <ol>
            <li>Log into ShieldSeller</li>
            <li>Navigate to <strong>Settings → Billing & Subscription</strong></li>
            <li>Click <strong>Cancel Subscription</strong></li>
            <li>Confirm cancellation</li>
          </ol>
          <p>Alternatively, email <strong>support@shieldseller.com</strong> with "Cancel Subscription" and your account email.</p>

          <h3>Cancellation Effective Date</h3>
          <p>Cancellations are effective immediately. Your access continues until the end of your current billing period.</p>

          <h3>No Cancellation Fees</h3>
          <p>There are no penalties or fees for cancellation at any time.</p>

          <h2>2. Refund Policy</h2>
          <h3>Monthly Subscriptions</h3>
          <ul>
            <li><strong>Refund Eligibility:</strong> Non-refundable</li>
            <li><strong>Rationale:</strong> Monthly billing provides maximum flexibility to cancel without penalty</li>
          </ul>

          <h3>Annual Subscriptions</h3>
          <ul>
            <li><strong>Refund Eligibility:</strong> 14-day money-back guarantee from purchase date</li>
            <li><strong>Full Refund:</strong> Available if requested within 14 days of purchase</li>
            <li><strong>After 14 Days:</strong> Non-refundable; however, you can cancel anytime (see Cancellation section above)</li>
          </ul>

          <h2>3. Refund Process</h2>
          <h3>Requesting a Refund (Annual Plans Only)</h3>
          <p><strong>Eligibility Check:</strong></p>
          <ul>
            <li>Within 14 days of purchase date</li>
            <li>Original annual subscription (not upgraded plan)</li>
            <li>Valid ShieldSeller account</li>
          </ul>

          <p><strong>How to Request:</strong></p>
          <ol>
            <li>Email <strong>refunds@shieldseller.com</strong></li>
            <li>Include:
              <ul>
                <li>Your account email address</li>
                <li>Purchase date / invoice number</li>
                <li>Brief reason for refund request</li>
              </ul>
            </li>
          </ol>

          <p><strong>Response Time:</strong></p>
          <ul>
            <li>Acknowledgment: Within 24 hours</li>
            <li>Approval/Denial: Within 3-5 business days</li>
            <li>Processing: Within 5-7 business days after approval</li>
          </ul>

          <h2>4. Exceptions & Special Cases</h2>
          <h3>Billing Errors</h3>
          <p>If you were incorrectly charged (duplicate billing, wrong amount, etc.):</p>
          <ul>
            <li>Contact <strong>support@shieldseller.com</strong> immediately</li>
            <li>Provide proof (screenshot of statement, invoice, etc.)</li>
            <li>Full refund issued within 5 business days</li>
          </ul>

          <h3>Unauthorized Transactions</h3>
          <p>If your account was charged without authorization:</p>
          <ul>
            <li>Contact <strong>support@shieldseller.com</strong> and Stripe support</li>
            <li>Provide any relevant evidence</li>
            <li>We will refund the charge and investigate</li>
          </ul>

          <h2>5. Data Retention After Cancellation</h2>
          <p><strong>After cancellation, your account data is retained for 30 days:</strong></p>
          <ul>
            <li>Listing analysis history</li>
            <li>Scan results and recommendations</li>
            <li>Account settings</li>
          </ul>
          <p>If you reactivate within 30 days, your data is restored automatically. After 30 days, all data is permanently deleted.</p>

          <h2>6. Frequently Asked Questions</h2>
          <h3>Q: Can I get a refund after 14 days on an annual plan?</h3>
          <p>A: No. After 14 days, annual plans are non-refundable. However, you can cancel anytime without penalty and stop future charges.</p>

          <h3>Q: What if I cancel mid-month on a monthly plan?</h3>
          <p>A: Your service continues until the end of your current billing period. You're not charged for the next month.</p>

          <h3>Q: Can I pause my subscription instead of canceling?</h3>
          <p>A: Not currently, but you can cancel and reactivate anytime without additional fees.</p>

          <h2>7. Contact Us</h2>
          <p>
            📧 Refunds: <a href="mailto:refunds@shieldseller.com">refunds@shieldseller.com</a><br />
            📧 Support: <a href="mailto:support@shieldseller.com">support@shieldseller.com</a><br />
            🕐 Hours: Monday-Friday, 9 AM - 6 PM EST
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