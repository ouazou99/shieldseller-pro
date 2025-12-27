'use client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Info, Filter, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ViolationsPage({
  searchParams,
}: {
  searchParams: { severity?: string; status?: string; shop?: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  // Build query filters
  const where: any = {
    listing: {
      shop: {
        userId: session.user.id,
      },
    },
  };

  if (searchParams.severity) {
    where.severity = searchParams.severity;
  }

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.shop) {
    where.listing = {
      ...where.listing,
      shopId: searchParams.shop,
    };
  }

  // Fetch violations with listing and shop info
  const violations = await prisma.violation.findMany({
    where,
    include: {
      listing: {
        include: {
          shop: {
            select: {
              id: true,
              shopName: true,
              platform: true,
            },
          },
        },
      },
    },
    orderBy: [
      { severity: 'desc' },
      { detectedAt: 'desc' },
    ],
    take: 100, // Limit to prevent performance issues
  });

  // Get shops for filter
  const shops = await prisma.shop.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      shopName: true,
    },
  });

  // Calculate stats
  const stats = {
    total: violations.length,
    critical: violations.filter(v => v.severity === 'critical').length,
    warning: violations.filter(v => v.severity === 'warning').length,
    info: violations.filter(v => v.severity === 'info').length,
    open: violations.filter(v => v.status === 'open').length,
    fixed: violations.filter(v => v.status === 'fixed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Violations</h1>
        <p className="text-gray-600 mt-1">
          Manage and fix all detected violations across your shops
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Violations"
          value={stats.total}
          color="blue"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          label="Critical"
          value={stats.critical}
          color="red"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          label="Open"
          value={stats.open}
          color="orange"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatsCard
          label="Fixed"
          value={stats.fixed}
          color="green"
          icon={<CheckCircle className="h-5 w-5" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Severity Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={searchParams.severity || ''}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value) {
                  params.set('severity', e.target.value);
                } else {
                  params.delete('severity');
                }
                window.location.href = `/dashboard/violations?${params.toString()}`;
              }}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={searchParams.status || ''}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value) {
                  params.set('status', e.target.value);
                } else {
                  params.delete('status');
                }
                window.location.href = `/dashboard/violations?${params.toString()}`;
              }}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="fixed">Fixed</option>
              <option value="dismissed">Dismissed</option>
            </select>

            {/* Shop Filter */}
            {shops.length > 1 && (
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={searchParams.shop || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(window.location.search);
                  if (e.target.value) {
                    params.set('shop', e.target.value);
                  } else {
                    params.delete('shop');
                  }
                  window.location.href = `/dashboard/violations?${params.toString()}`;
                }}
              >
                <option value="">All Shops</option>
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.shopName}
                  </option>
                ))}
              </select>
            )}

            {/* Clear Filters */}
            {(searchParams.severity || searchParams.status || searchParams.shop) && (
              <Link href="/dashboard/violations">
                <Button variant="ghost" size="sm">
                  Clear Filters
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      {violations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No violations found!
              </h3>
              <p className="mt-2 text-gray-600">
                {searchParams.severity || searchParams.status || searchParams.shop
                  ? 'Try adjusting your filters'
                  : 'All your listings are compliant. Great job!'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {violations.map((violation) => (
            <ViolationCard key={violation.id} violation={violation} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatsCard({ label, value, color, icon }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function ViolationCard({ violation }: any) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  };

  const config = severityConfig[violation.severity as keyof typeof severityConfig];
  const Icon = config.icon;

  return (
    <Card className={`${config.borderColor} border-l-4`}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-1`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badgeColor}`}>
                  {violation.severity}
                </span>
                <Badge variant={violation.status === 'open' ? 'default' : 'success'}>
                  {violation.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(violation.detectedAt, 'short')}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">
                {violation.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-2">
                {violation.description}
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-medium">Product:</span> {violation.listing.title}
                </p>
                <p>
                  <span className="font-medium">Shop:</span> {violation.listing.shop.shopName} ({violation.listing.shop.platform})
                </p>
              </div>
              
              {violation.suggestion && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    💡 Suggested Fix:
                  </p>
                  <p className="text-sm text-gray-600">{violation.suggestion}</p>
                </div>
              )}
            </div>
          </div>
          
          <Link href={`/dashboard/listings/${violation.listingId}`}>
            <Button variant="outline" size="sm" className="flex-shrink-0 ml-4">
              View Listing
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
