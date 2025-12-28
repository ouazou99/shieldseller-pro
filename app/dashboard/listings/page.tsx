import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Package, Filter } from 'lucide-react';
import { getRiskBadgeColor, truncate } from '@/lib/utils';

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { shop?: string; risk?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Build query filters
  const where: any = {
    shop: {
      userId: session.user.id,
    },
  };

  if (searchParams.shop) {
    where.shopId = searchParams.shop;
  }

  if (searchParams.risk) {
    where.riskLevel = searchParams.risk;
  }

  // Fetch listings
  const listings = await prisma.listing.findMany({
    where,
    include: {
      shop: {
        select: {
          id: true,
          shopName: true,
          platform: true,
        },
      },
      violations: {
        where: { status: 'open' },
        select: {
          id: true,
          severity: true,
        },
      },
    },
    orderBy: { riskScore: 'desc' },
  });

  // Get all shops for filter
  const shops = await prisma.shop.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      shopName: true,
    },
  });

  // Calculate stats
  const totalListings = listings.length;
  const criticalCount = listings.filter(l => l.riskLevel === 'critical').length;
  const highCount = listings.filter(l => l.riskLevel === 'high').length;
  const safeCount = listings.filter(l => l.riskLevel === 'safe').length;

  const hasFilters = Boolean(searchParams.shop || searchParams.risk);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Listings</h1>
          <p className="text-gray-600 mt-1">
            {totalListings} product{totalListings !== 1 ? 's' : ''} monitored
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload More</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={totalListings} color="blue" />
        <StatCard label="Safe" value={safeCount} color="green" />
        <StatCard label="High Risk" value={highCount} color="orange" />
        <StatCard label="Critical" value={criticalCount} color="red" />
      </div>

      {/* Filters - using form like violations page */}
      <Card>
        <CardContent className="py-4">
          <form method="get" className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Shop Filter */}
            {shops.length > 1 && (
              <select
                name="shop"
                defaultValue={searchParams.shop || ''}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Shops</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName}
                  </option>
                ))}
              </select>
            )}
            
            {/* Risk Level Filter */}
            <select
              name="risk"
              defaultValue={searchParams.risk || ''}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Risk Levels</option>
              <option value="safe">Safe</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <Button type="submit" size="sm">
              Apply
            </Button>

            {/* Clear Filters */}
            {hasFilters && (
              <Link href="/dashboard/listings">
                <Button variant="ghost" size="sm" type="button">
                  Clear Filters
                </Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Listings Table */}
      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No listings found</h3>
              <p className="mt-2 text-gray-600">
                Upload a CSV file to start monitoring your products
              </p>
              <Link href="/dashboard/upload" className="mt-4 inline-block">
                <Button>Upload Listings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Violations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map((listing) => {
                const criticalViolations = listing.violations.filter(v => v.severity === 'critical').length;
                
                return (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {listing.imageUrl && (
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {truncate(listing.title, 60)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {listing.productId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{listing.shop.shopName}</p>
                      <p className="text-xs text-gray-500">{listing.shop.platform}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(listing.riskLevel)}`}>
                        {Math.round(listing.riskScore)}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {listing.violations.length}
                        </span>
                        {criticalViolations > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
                            {criticalViolations} critical
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        listing.status === 'active' ? 'success' :
                        listing.status === 'flagged' ? 'danger' :
                        'default'
                      }>
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/listings/${listing.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}