import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import AddShopForm from '@/components/dashboard/AddShopForm';
import { Store, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { getRiskBadgeColor, formatDate } from '@/lib/utils';

export default async function ShopsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

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
    orderBy: { createdAt: 'desc' },
  });

  // Get subscription to check shop limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const canAddShop = shops.length < (subscription?.shopsLimit || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shops</h1>
          <p className="text-gray-600 mt-1">
            Manage your connected TikTok Shops and other platforms
          </p>
        </div>
      </div>

      {/* Shop Limit Warning */}
      {!canAddShop && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Shop limit reached ({shops.length}/{subscription?.shopsLimit})
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  <Link href="/pricing" className="underline">Upgrade your plan</Link> to add more shops
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Shop Section */}
      {canAddShop && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <AddShopForm />
          </CardContent>
        </Card>
      )}

      {/* Shops List */}
      {shops.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No shops yet</h3>
              <p className="mt-2 text-gray-600">
                Add your first shop to start monitoring your listings
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shops.map((shop) => {
            const totalViolations = shop.listings.reduce(
              (sum, listing) => sum + listing.violations.length,
              0
            );
            const highRiskCount = shop.listings.filter(
              l => l.riskLevel === 'high' || l.riskLevel === 'critical'
            ).length;

            return (
              <Card key={shop.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Store className="h-5 w-5 text-brand-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {shop.shopName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {shop.platform} • Added {formatDate(shop.createdAt, 'short')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      shop.status === 'active' ? 'bg-green-100 text-green-800' :
                      shop.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {shop.status}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {shop.totalProducts}
                        </p>
                        <p className="text-xs text-gray-600">Products</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {totalViolations}
                        </p>
                        <p className="text-xs text-gray-600">Violations</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Risk Score
                      </span>
                      <span className={`text-lg font-bold ${
                        shop.riskScore < 30 ? 'text-green-600' :
                        shop.riskScore < 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(shop.riskScore)}/100
                      </span>
                    </div>
                    {highRiskCount > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {highRiskCount} high-risk listing{highRiskCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/shops/${shop.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/dashboard/listings?shop=${shop.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        View Listings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
