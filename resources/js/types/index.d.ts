import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
  
    // ✅ Account settings fields
    phone?: string | null;
    company_name?: string | null;
    job_title?: string | null;
  
    country?: string | null;
    state?: string | null;
    city?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    postal_code?: string | null;
  
    preferred_contact?: 'email' | 'phone' | 'whatsapp' | null;
    timezone?: string | null;
    locale?: string | null;
  
    notification_preferences?: {
      order_updates?: boolean;
      quote_updates?: boolean;
      promotions?: boolean;
    } | null;
  
    // Keep this last
    [key: string]: unknown;
  }
  
