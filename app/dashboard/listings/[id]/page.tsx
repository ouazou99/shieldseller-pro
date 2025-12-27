import { getServerSession } from 'next/auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, ExternalLink, Shield } from 'lucide-react';
import { getRiskBadgeColor, formatDate } from '@/lib/utils';

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const listing = await prisma.listing.findFirst({
    where: {
      id: params.id,
      shop: {
        userId: session.user.id,
      },
    },
    include: {
      shop: true,
      violations: {
        orderBy: { detectedAt: 'desc' },
      },
    },
  });

  if (!listing) {
    redirect('/dashboard/listings');
  }

  // Group violations by severity
  const criticalViolations = listing.violations.filter(v => v.severity === 'critical' && v.status === 'open');
  const warningViolations = listing.violations.filter(v => v.severity === 'warning' && v.status === 'open');
  const infoViolations = listing.violations.filter(v => v.severity === 'info' && v.status === 'open');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/listings">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-600">
              {listing.shop.shopName} • {listing.shop.platform}
            </span>
            <Badge variant={
              listing.status === 'active' ? 'success' :
              listing.status === 'flagged' ? 'danger' :
              'default'
            }>
              {listing.status}
            </Badge>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold ${getRiskBadgeColor(listing.riskLevel)}`}>
            {Math.round(listing.riskScore)}/100
          </div>
          <p className="text-xs text-gray-600 mt-1">Risk Score</p>
        </div>
      </div>

      {/* Quick Actions */}
      {criticalViolations.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {criticalViolations.length} critical violation{criticalViolations.length !== 1 ? 's' : ''} detected
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Fix immediately to avoid suspension
                  </p>
                </div>
              </div>
              <Button variant="danger" size="sm">
                Fix Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.imageUrl && (
                <div>
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full max-w-md rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Product ID</h4>
                <p className="text-sm text-gray-900">{listing.productId}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Title</h4>
                <p className="text-sm text-gray-900">{listing.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{listing.description}</p>
              </div>

              {listing.category && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Category</h4>
                  <p className="text-sm text-gray-900">{listing.category}</p>
                </div>
              )}

              {listing.price && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Price</h4>
                  <p className="text-sm text-gray-900">${listing.price.toFixed(2)}</p>
                </div>
              )}

              {listing.productUrl && (
                <div>
                  <a
                    href={listing.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-brand-600 hover:text-brand-700"
                  >
                    View on {listing.shop.platform}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Violations */}
          <Card>
            <CardHeader>
              <CardTitle>Detected Violations ({listing.violations.filter(v => v.status === 'open').length})</CardTitle>
            </CardHeader>
            <CardContent>
              {listing.violations.filter(v => v.status === 'open').length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 text-sm text-gray-600">
                    No violations detected. This listing looks good!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Critical */}
                  {criticalViolations.map((violation) => (
                    <ViolationCard key={violation.id} violation={violation} />
                  ))}
                  
                  {/* Warnings */}
                  {warningViolations.map((violation) => (
                    <ViolationCard key={violation.id} violation={violation} />
                  ))}
                  
                  {/* Info */}
                  {infoViolations.map((violation) => (
                    <ViolationCard key={violation.id} violation={violation} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metrics & Stats */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetricItem label="Views" value={listing.views} />
              <MetricItem label="Orders" value={listing.orders} />
              <MetricItem 
                label="Return Rate" 
                value={`${(listing.returnRate * 100).toFixed(1)}%`}
                alert={listing.returnRate > 0.15}
              />
              <MetricItem 
                label="Rating" 
                value={`${listing.rating.toFixed(1)}/5.0`}
                alert={listing.rating < 4.0 && listing.reviewCount > 10}
              />
              <MetricItem label="Reviews" value={listing.reviewCount} />
            </CardContent>
          </Card>

          {/* Risk Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Overall Score</span>
                <span className={`text-lg font-bold ${
                  listing.riskScore < 30 ? 'text-green-600' :
                  listing.riskScore < 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(listing.riskScore)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Risk Level</span>
                <span className={`px-2 py-1 rounded ${getRiskBadgeColor(listing.riskLevel)}`}>
                  {listing.riskLevel}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Open Violations</span>
                <span className="font-medium">{listing.violations.filter(v => v.status === 'open').length}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Critical Issues</span>
                <span className="font-medium text-red-600">{criticalViolations.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Last Scan */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <div>
                  <p className="font-medium">Last Scanned</p>
                  <p className="text-xs">{listing.lastScannedAt ? formatDate(listing.lastScannedAt, 'long') : 'Never'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="py-4 space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                Rescan Listing
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Export Report
              </Button>
              <Button variant="danger" className="w-full" size="sm">
                Delete Listing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ViolationCard({ violation }: { violation: any }) {
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
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badgeColor}`}>
              {violation.severity}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(violation.detectedAt, 'short')}
            </span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">{violation.title}</h4>
          <p className="text-sm text-gray-700 mb-2">{violation.description}</p>
          
          {violation.suggestion && (
            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-1">💡 Suggested Fix:</p>
              <p className="text-sm text-gray-600">{violation.suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700">{label}</span>
      <span className={`font-medium ${alert ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}
