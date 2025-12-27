import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Bell, CheckCircle, AlertTriangle, Info, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    include: {
      shop: {
        select: {
          shopName: true,
          platform: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <form action="/api/alerts" method="DELETE">
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </form>
        )}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No alerts yet
              </h3>
              <p className="mt-2 text-gray-600">
                You'll receive notifications here when violations are detected
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert }: any) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-l-red-500',
      iconColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500',
      iconColor: 'text-yellow-600',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500',
      iconColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-800',
    },
  };

  const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.info;
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.borderColor} ${!alert.read ? 'bg-white' : 'bg-gray-50'}`}>
      <CardContent className="py-4">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badgeColor}`}>
                {alert.severity}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(alert.createdAt, 'long')}
              </span>
              {!alert.read && (
                <span className="inline-flex h-2 w-2 rounded-full bg-brand-600"></span>
              )}
            </div>
            
            <p className="text-gray-900 mb-1">{alert.message}</p>
            
            {alert.shop && (
              <p className="text-sm text-gray-600">
                Shop: {alert.shop.shopName} ({alert.shop.platform})
              </p>
            )}
            
            {alert.sentEmail && (
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Email notification sent
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
