import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and subscription
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                defaultValue={user.name || ''}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                disabled
              />
            </div>

            <div className="pt-4">
              <Button variant="outline" disabled>
                Save Changes (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Plan</span>
                <Badge variant={subscription?.plan === 'free' ? 'default' : 'success'}>
                  {subscription?.plan.toUpperCase()}
                </Badge>
              </div>
              
              {subscription && subscription.plan !== 'free' && (
                <>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Status: <span className="font-medium capitalize">{subscription.status}</span></p>
                    {subscription.currentPeriodEnd && (
                      <p>Renews: {formatDate(subscription.currentPeriodEnd, 'long')}</p>
                    )}
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <a
                      href={process.env.STRIPE_CUSTOMER_PORTAL_URL || '#'}
                      className="block"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Subscription
                      </Button>
                    </a>
                  </div>
                </>
              )}
              
              {subscription?.plan === 'free' && (
                <div className="pt-4">
                  <a href="/pricing">
                    <Button size="sm" className="w-full">
                      Upgrade Plan
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Limits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Usage & Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsageMeter
              label="Shops"
              current={subscription?.shopsLimit || 1}
              limit={subscription?.shopsLimit || 1}
            />
            
            <UsageMeter
              label="Daily Scans"
              current={0}
              limit={subscription?.scansPerDay || 1}
            />
            
            <UsageMeter
              label="AI Rewrites This Month"
              current={subscription?.aiRewritesLimit || 0}
              limit={subscription?.aiRewritesLimit || 0}
            />

            {(subscription?.plan === 'free' || !subscription) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Upgrade to unlock:</strong> More shops, unlimited scans, and AI-powered fixes!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Email alerts</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Daily reports</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                disabled
              />
              <span className="text-sm text-gray-500">SMS alerts (Pro+)</span>
            </label>

            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full" disabled>
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="danger" size="sm" disabled>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageMeter({ label, current, limit }: { label: string; current: number; limit: number }) {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {current} / {limit}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
