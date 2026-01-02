'use client';

import { usePathname } from 'next/navigation';
import { Bot, CalendarClock, LayoutDashboard, PlusCircle } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/create',
    label: 'Create Post',
    icon: PlusCircle,
  },
  {
    href: '/scheduled',
    label: 'Scheduled',
    icon: CalendarClock,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold text-foreground">autopx</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(link.href)}
                  tooltip={link.label}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
