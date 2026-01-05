import AppLogo from '@/components/app-logo';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    User,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function UserLayout({ children, title }: UserLayoutProps) {
    const { auth } = usePage<SharedData>().props || {};
    const user = auth?.user ?? null; // ✅ safely handle missing auth

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white shadow-sm transition-colors duration-300 md:flex dark:border-gray-700 dark:bg-gray-800">
                {/* Logo */}
                <div className="flex px-20 flex-shrink-0 items-center">
                    <Link href="/" aria-label="Go to homepage">
                        <AppLogo size="h-20 w-auto" />
                    </Link>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <LayoutDashboard className="h-5 w-5" /> Overview
                    </Link>

                    <Link
                        href="/catalog"
                        className="flex items-center gap-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <Package className="h-5 w-5" /> Catalog
                    </Link>

                    <Link
                        href="/cart"
                        className="flex items-center gap-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <ShoppingCart className="h-5 w-5" /> My Cart
                    </Link>

                    <Link
                        href="/my-orders"
                        className="flex items-center gap-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        <Package className="h-5 w-5" /> Orders
                    </Link>

                    {/* Settings Dropdown */}
                    <div>
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className="flex w-full items-center justify-between gap-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5" /> Settings
                            </div>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {settingsOpen && (
                            <div className="mt-1 ml-6 flex flex-col space-y-1">
                                <Link
                                    href="/settings/profile"
                                    className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings/account"
                                    className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Account
                                </Link>
                                <Link
                                    href="/settings/security"
                                    className="rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Security
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Top Navbar */}
                <header className="relative flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {title ?? 'Dashboard'}
                    </h1>

                    {/* User menu */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 text-gray-600 focus:outline-none dark:text-gray-200"
                        >
                            <User className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                {user ? user.name : 'Guest'}
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                                {user ? (
                                    <>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
