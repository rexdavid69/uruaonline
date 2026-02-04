/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLogo from '@/components/app-logo';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    FileText,
    LayoutDashboard,
    Moon,
    Package,
    Settings,
    ShoppingCart,
    Sun,
    User,
    UserCog,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

interface BackendLayoutProps {
    children: ReactNode;
    title?: string;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export default function BackendLayout({
    children,
    title = 'Dashboard',
}: BackendLayoutProps) {
    const { props, url } = usePage<PageProps>();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [productsOpen, setProductsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const username = props.auth?.user?.name ?? 'Admin';

    const currentPath = useMemo(() => (url || '').split('?')[0], [url]);

    const isActive = (path: string) =>
        currentPath === path || currentPath.startsWith(path + '/');

    /* -------------------- THEME -------------------- */
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        }
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const next = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        setTheme(next);
    };

    /* -------------------- NOTIFICATIONS -------------------- */
    const fetchNotifications = async () => {
        try {
            const res = await fetch('/backend/notifications', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!res.ok) return;

            const data = await res.json();
            setNotifications(data.items ?? []);
            setUnreadCount(data.unreadCount ?? 0);
        } catch {}
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        await fetch('/backend/notifications/read-all', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN':
                    (
                        document.querySelector(
                            'meta[name="csrf-token"]',
                        ) as HTMLMetaElement
                    )?.content ?? '',
            },
            credentials: 'same-origin',
        });
        fetchNotifications();
    };

    /* -------------------- UI COMPONENTS -------------------- */
    const NavItem = ({
        href,
        icon,
        label,
    }: {
        href: string;
        icon: ReactNode;
        label: string;
    }) => {
        const active = isActive(href);
        return (
            <Link
                href={href}
                className={cx(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    active
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
                )}
            >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 dark:bg-gray-900">
                    {icon}
                </span>
                {label}
            </Link>
        );
    };

    /* -------------------- AUTO OPEN PRODUCTS -------------------- */
    useEffect(() => {
        if (isActive('/backend/products') || isActive('/backend/producers')) {
            setProductsOpen(true);
        }
    }, [currentPath, isActive]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="flex">
                {/* ================= SIDEBAR ================= */}
                <aside className="hidden w-72 flex-col border-r border-gray-200 bg-white lg:flex dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex h-20 items-center gap-3 border-b px-6 dark:border-gray-800">
                        <AppLogo size="h-12" />
                        <div>
                            <div className="text-sm font-semibold">Admin</div>
                            <div className="text-xs text-gray-500">
                                UruaOnline
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2 p-4">
                        <NavItem
                            href="/backend/dashboard"
                            label="Dashboard"
                            icon={<LayoutDashboard className="h-5 w-5" />}
                        />

                        <NavItem
                            href="/backend/notifications-page"
                            label="Notifications"
                            icon={<Bell className="h-5 w-5" />}
                        />

                        <NavItem
                            href="/backend/users"
                            label="Users"
                            icon={<User className="h-5 w-5" />}
                        />

                        {/* Products */}
                        <button
                            onClick={() => setProductsOpen(!productsOpen)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <span className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 dark:bg-gray-900">
                                    <Package className="h-5 w-5" />
                                </span>
                                Products
                            </span>
                            <ChevronDown
                                className={cx(
                                    'h-4 w-4 transition',
                                    productsOpen && 'rotate-180',
                                )}
                            />
                        </button>

                        {productsOpen && (
                            <div className="ml-12 space-y-1">
                                <Link
                                    href="/backend/products"
                                    className={cx(
                                        'block rounded-lg px-3 py-2 text-sm',
                                        isActive('/backend/products')
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                    )}
                                >
                                    All Products
                                </Link>
                                <Link
                                    href="/backend/producers"
                                    className={cx(
                                        'block rounded-lg px-3 py-2 text-sm',
                                        isActive('/backend/producers')
                                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                                    )}
                                >
                                    Producers
                                </Link>
                            </div>
                        )}

                        <NavItem
                            href="/backend/orders"
                            label="Orders"
                            icon={<ShoppingCart className="h-5 w-5" />}
                        />

                        <NavItem
                            href="/backend/quotes"
                            label="Quotes"
                            icon={<FileText className="h-5 w-5" />}
                        />

                        <NavItem
                            href="/backend/settings"
                            label="Settings"
                            icon={<Settings className="h-5 w-5" />}
                        />
                    </nav>
                </aside>

                {/* ================= MAIN ================= */}
                <div className="flex flex-1 flex-col">
                    {/* Topbar */}
                    <header className="sticky top-0 z-40 border-b bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-bold">{title}</h1>

                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setNotifOpen(!notifOpen)}
                                        className="relative rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-1 text-xs text-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {notifOpen && (
                                        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-lg dark:bg-gray-900">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm font-semibold">
                                                    Notifications
                                                </span>
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs text-gray-500 hover:text-gray-900"
                                                >
                                                    Mark all read
                                                </button>
                                            </div>

                                            <div className="max-h-80 overflow-auto border-t dark:border-gray-800">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-sm text-gray-500">
                                                        No notifications
                                                    </div>
                                                ) : (
                                                    notifications.map((n) => (
                                                        <div
                                                            key={n.id}
                                                            className="border-b px-4 py-3 text-sm dark:border-gray-800"
                                                        >
                                                            <div className="font-semibold">
                                                                {n.title}
                                                            </div>
                                                            {n.message && (
                                                                <div className="text-gray-500">
                                                                    {n.message}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Theme */}
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {theme === 'light' ? (
                                        <Moon className="h-5 w-5" />
                                    ) : (
                                        <Sun className="h-5 w-5" />
                                    )}
                                </button>

                                {/* User */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setUserMenuOpen(!userMenuOpen)
                                        }
                                        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <UserCog className="h-5 w-5" />
                                        <span className="hidden sm:block">
                                            {username}
                                        </span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg dark:bg-gray-900">
                                            <Link
                                                href="/backend/logout"
                                                method="post"
                                                as="button"
                                                className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 p-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-900">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
