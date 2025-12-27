import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, Package, AlertTriangle, TrendingUp, Store } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getRiskBadgeColor } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Fetch user's shops and metrics
  const shops = await prisma.shop.findMany({
    where: { userId: session.user.id },
    include: {
      listings: {
        include: {
          violations: {
            where: { status: 'open' },
          },
        },
      },
    },
  });

  // Calculate metrics
  const totalShops = shops.length;
  const totalListings = shops.reduce((sum, shop) => sum + shop.listings.length, 0);
  const totalViolations = shops.reduce(
    (sum, shop) => sum + shop.listings.reduce((s, l) => s + l.violations.length, 0),
    0
  );
  
  // Calculate average risk score
  const avgRiskScore = totalListings > 0
    ? Math.round(shops.reduce((sum, shop) => sum + shop.riskScore, 0) / shops.length)
    : 0;

  // Get high-risk listings
  const highRiskListings = shops
    .flatMap(shop => shop.listings)
    .filter(listing => listing.riskLevel === 'high' || listing.riskLevel === 'critical')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  // Get recent violations
  const recentViolations = shops
    .flatMap(shop => shop.listings.flatMap(listing => 
      listing.violations.map(v => ({ ...v, listing }))
    ))
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session.user.name || 'there'}! Here&apos;s your store overview.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload Listings</Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Shops"
          value={totalShops}
          icon={Store}
          color="blue"
          description={totalShops === 0 ? 'Add your first shop' : 'Active shops'}
        />
        
        <MetricCard
          title="Total Listings"
          value={totalListings}
          icon={Package}
          color="purple"
          description={totalListings === 0 ? 'No listings yet' : 'Products monitored'}
        />
        
        <MetricCard
          title="Open Violations"
          value={totalViolations}
          icon={AlertTriangle}
          color={totalViolations > 0 ? 'red' : 'green'}
          description={totalViolations > 0 ? 'Needs attention' : 'All clear!'}
        />
        
        <MetricCard
          title="Average Risk Score"
          value={avgRiskScore}
          icon={Shield}
          color={avgRiskScore < 30 ? 'green' : avgRiskScore < 60 ? 'yellow' : 'red'}
          description={getRiskLevelText(avgRiskScore)}
          showBadge
          badgeValue={`${avgRiskScore}/100`}
        />
      </div>

      {/* Empty State */}
      {totalShops === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No shops connected</h3>
              <p className="mt-2 text-gray-600">
                Get started by adding your first TikTok Shop or uploading your product listings.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <Link href="/dashboard/shops">
                  <Button>Add Shop</Button>
                </Link>
                <Link href="/dashboard/upload">
                  <Button variant="outline">Upload CSV</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content when shops exist */}
      {totalShops > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shops List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shops.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/dashboard/shops/${shop.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-sm transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{shop.shopName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {shop.totalProducts} products • {shop.platform}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(shop.riskScore < 30 ? 'safe' : shop.riskScore < 60 ? 'low' : 'high')}`}>
                          {shop.riskScore}/100
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                <Link href="/dashboard/shops">
                  <Button variant="outline" className="w-full">
                    View All Shops
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* High-Risk Listings */}
          <Card>
            <CardHeader>
              <CardTitle>High-Risk Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {highRiskListings.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 text-sm text-gray-600">
                    No high-risk listings detected. Great job!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {highRiskListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/dashboard/listings/${listing.id}`}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {listing.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {listing.violations.length} violation{listing.violations.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getRiskBadgeColor(listing.riskLevel)}`}>
                          {listing.riskScore}
                        </span>
                      </div>
                    </Link>
                  ))}
                  
                  <Link href="/dashboard/listings">
                    <Button variant="outline" className="w-full">
                      View All Listings
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Violations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Violations</CardTitle>
            </CardHeader>
            <CardContent>
              {recentViolations.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    No violations detected yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentViolations.map((violation) => (
                    <div
                      key={violation.id}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              violation.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              violation.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {violation.severity}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(violation.detectedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mt-2">
                            {violation.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {violation.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Product: {violation.listing.title}
                          </p>
                        </div>
                        <Link href={`/dashboard/listings/${violation.listingId}`}>
                          <Button variant="outline" size="sm">
                            Fix Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  <Link href="/dashboard/violations">
                    <Button variant="outline" className="w-full">
                      View All Violations
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  description,
  showBadge,
  badgeValue,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  showBadge?: boolean;
  badgeValue?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {showBadge && badgeValue && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-600">Score: {badgeValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getRiskLevelText(score: number): string {
  if (score < 30) return 'Safe zone';
  if (score < 50) return 'Low risk';
  if (score < 70) return 'Medium risk';
  if (score < 85) return 'High risk';
  return 'Critical';
}
