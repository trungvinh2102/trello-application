import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Boards', href: '/', icon: '📋' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 bg-card border-r border-border min-h-screen overflow-hidden`}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold">Trello</h1>
          </div>
          <nav className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Welcome back, User</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  U
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
