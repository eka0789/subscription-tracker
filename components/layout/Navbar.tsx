'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-indigo-600 ${
      pathname === href || pathname.startsWith(href)
        ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
        : 'text-gray-600'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 flex-wrap gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Bell className="w-5 h-5" />
            SubTracker
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link href="/subscriptions" className={linkClass('/subscriptions')}>
              Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
