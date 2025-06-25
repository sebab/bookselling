'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Upload, BarChart3, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

const navigation = [
  {
    name: 'Library',
    href: '/dashboard',
    icon: Book,
  },
  {
    name: 'Add Books',
    href: '/upload',
    icon: Upload,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    adminOnly: true,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || (user?.role === 'admin' || user?.role === 'manager')
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Book className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">BookCatalog</span>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Button
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-secondary"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}