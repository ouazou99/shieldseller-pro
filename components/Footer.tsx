import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">ShieldSeller</h3>
            <p className="text-sm text-slate-400">
              Protect your TikTok Shop seller account with AI-powered compliance monitoring.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <p className="text-slate-400">Raleigh, NC<br />USA</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:support@shieldseller.com"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  support@shieldseller.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:refunds@shieldseller.com"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  refunds@shieldseller.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="text-slate-400">Mon-Fri, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/pricing"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/features"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@shieldseller.com"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/privacy"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund-policy"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy"
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 py-8">
          {/* Bottom Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} ShieldSeller. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a 
                href="https://twitter.com/shieldseller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                Twitter
              </a>
              <a 
                href="https://instagram.com/shieldseller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                Instagram
              </a>
              <a 
                href="https://tiktok.com/@shieldseller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                TikTok
              </a>
              <a 
                href="https://linkedin.com/company/shieldseller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              ShieldSeller is an independent third-party service and is not affiliated with, endorsed by, or officially connected to TikTok or ByteDance. 
              TikTok is a trademark of ByteDance. Use of ShieldSeller does not guarantee compliance with TikTok Shop policies.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}