import Link from 'next/link';
import { Shield, AlertTriangle, TrendingUp, Zap, CheckCircle, Bell } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-brand-600" />
              <span className="text-2xl font-bold text-gray-900">ShieldSeller</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Now supporting TikTok Shop, Amazon coming soon
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Stop TikTok Shop <br />
            <span className="text-brand-600">Violations</span> Before <br />
            They Stop You
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
            Automatically detect violations, monitor SPS scores, and protect your store 
            from suspension. <span className="font-semibold text-gray-900">Save your revenue before it's too late.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Start Free Trial →
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                See How It Works
              </Button>
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Free 7-day trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
        
        {/* Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl shadow-2xl border-8 border-gray-200 overflow-hidden bg-white">
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Shield className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <p className="text-2xl font-semibold">Dashboard Preview</p>
                <p className="text-blue-100">Coming in your trial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Sellers Are Losing Everything
              </h2>
              <p className="text-xl text-gray-600">
                Without warning. Without time to fix it. Without a safety net.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-red-600 mb-2">68%</div>
                <p className="text-gray-900 font-semibold mb-2">Account Suspensions</p>
                <p className="text-sm text-gray-600">
                  Of sellers face violations within their first 6 months
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-red-600 mb-2">$47K</div>
                <p className="text-gray-900 font-semibold mb-2">Average Loss</p>
                <p className="text-sm text-gray-600">
                  Lost revenue when an account gets suspended
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl font-bold text-red-600 mb-2">0</div>
                <p className="text-gray-900 font-semibold mb-2">Second Chances</p>
                <p className="text-sm text-gray-600">
                  Most platforms ban permanently after 2-3 violations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Store's Guardian Angel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ShieldSeller monitors every listing, every metric, and every policy change so you don't have to.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Protection in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in under 5 minutes. No technical skills required.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 bg-gray-800 p-8 rounded-xl">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-2xl font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include 7-day free trial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
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
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Don't Wait for a Violation
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of sellers protecting their TikTok Shop stores with ShieldSeller.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-12">
              Get Started Free →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="w-8 h-8 text-brand-400" />
              <span className="text-2xl font-bold">ShieldSeller</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 ShieldSeller. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Shield className="w-6 h-6 text-brand-600" />,
    title: 'Real-Time Risk Scoring',
    description: 'Get a live 0-100 risk score for every listing. Know exactly which products are dangerous.',
  },
  {
    icon: <Bell className="w-6 h-6 text-brand-600" />,
    title: 'Instant Violation Alerts',
    description: 'Get notified the moment a listing violates TikTok policies. Fix it before TikTok sees it.',
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-600" />,
    title: 'AI-Powered Fixes',
    description: 'One-click AI rewrites that turn risky listings into compliant ones in seconds.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-brand-600" />,
    title: 'Performance Monitoring',
    description: 'Track returns, ratings, and shipping metrics that affect your SPS score.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-brand-600" />,
    title: 'Daily Health Reports',
    description: 'Morning email with your shop health score and action items for the day.',
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-brand-600" />,
    title: 'Keyword Blacklist',
    description: 'Automatically detect 500+ forbidden keywords and phrases that trigger bans.',
  },
];

const steps = [
  {
    title: 'Connect Your TikTok Shop',
    description: 'Link your store in 30 seconds. We scan all your listings immediately.',
  },
  {
    title: 'Get Your Risk Score',
    description: 'See which listings are dangerous and why. Clear explanations for every violation.',
  },
  {
    title: 'Fix Issues Automatically',
    description: 'Use our AI to rewrite listings or follow step-by-step guides. Stay protected 24/7.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 19,
    popular: false,
    features: [
      '1 TikTok Shop',
      'Daily risk scans',
      'Email alerts',
      'Basic violation detection',
      '7-day free trial',
    ],
  },
  {
    name: 'Pro',
    price: 49,
    popular: true,
    features: [
      '3 TikTok Shops',
      'Real-time monitoring',
      'AI-powered fixes',
      'SMS + Email alerts',
      'Export reports',
      'Priority support',
      '7-day free trial',
    ],
  },
  {
    name: 'Agency',
    price: 149,
    popular: false,
    features: [
      '10+ TikTok Shops',
      'Team collaboration',
      'White-label reports',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      '7-day free trial',
    ],
  },
];
