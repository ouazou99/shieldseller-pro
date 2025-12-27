import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Shops', href: '/dashboard/shops', icon: 'Shield' },
    { name: 'Listings', href: '/dashboard/listings', icon: 'Package' },
    { name: 'Violations', href: '/dashboard/violations', icon: 'AlertTriangle' },
    { name: 'Upload', href: '/dashboard/upload', icon: 'Upload' },
    { name: 'Alerts', href: '/dashboard/alerts', icon: 'Bell' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav navigation={navigation} user={session.user} />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
          <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition"
                >
                  <span className="mr-3 text-sm">📊</span>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:pl-64 flex-1 pt-16">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
