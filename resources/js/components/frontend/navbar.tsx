/* eslint-disable @typescript-eslint/no-explicit-any */
import CartDrawer from '@/components/frontend/cart-drawer';
import { useAppearance } from '@/hooks/use-appearance';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLogo from '../app-logo';

export default function Navbar() {
    const { appearance, updateAppearance } = useAppearance();
    const { url, props } = usePage<SharedData>();
    const { auth } = props;

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [cartOpen, setCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    /* ---------------- Cart Count ---------------- */
    useEffect(() => {
        fetch('/api/cart')
            .then((res) => res.json())
            .then((data) => {
                const items = Array.isArray(data?.cart) ? data.cart : [];
                const total = items.reduce(
                    (sum: number, item: any) => sum + (item.quantity || 0),
                    0,
                );
                setCartCount(total);
            })
            .catch(() => {});
    }, [cartOpen]);

    /* ---------------- Scroll Effect ---------------- */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleTheme = () => {
        updateAppearance(appearance === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80'
                        : 'bg-gradient-to-r from-cyan-700 to-blue-950'
                }`}
            >
                <div className="mx-auto flex h-25 max-w-7xl items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" aria-label="UruaOnline Home">
                        <AppLogo size="h-30 w-auto" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden items-center gap-8 lg:flex">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition ${
                                url === '/'
                                    ? 'text-cyan-400'
                                    : 'text-white hover:text-cyan-300'
                            }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/contactus"
                            className={`text-sm font-medium transition ${
                                url === '/contactus'
                                    ? 'text-cyan-400'
                                    : 'text-white hover:text-cyan-300'
                            }`}
                        >
                            Contact
                        </Link>

                        <Link
                            href="/catalog"
                            className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-cyan-600"
                        >
                            Browse Catalog
                        </Link>
                    </div>

                    {/* Right Actions (Desktop) */}
                    <div className="hidden items-center gap-5 lg:flex">
                        {/* Cart */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative text-white transition hover:text-cyan-300"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Auth */}
                        {!auth.user ? (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-white transition hover:text-cyan-300"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                    className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-cyan-300"
                                >
                                    <User className="h-5 w-5" />
                                    {auth.user.name}
                                    <ChevronDown
                                        className={`h-4 w-4 transition ${
                                            dropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg dark:bg-gray-800">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Theme */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-2 text-white transition hover:bg-white/10"
                            aria-label="Toggle theme"
                        >
                            {appearance === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5 text-yellow-300" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-4 lg:hidden">
                        {/* Theme */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-full p-2 text-white transition hover:bg-white/10"
                            aria-label="Toggle theme"
                        >
                            {appearance === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5 text-yellow-300" />
                            )}
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative text-white"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-2xl text-white"
                            aria-label="Open menu"
                        >
                            {menuOpen ? <X /> : '☰'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ================= MOBILE MENU ================= */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
                    onClick={() => setMenuOpen(false)}
                >
                    <div
                        className="absolute right-0 mt-[6.5rem] w-1/2 max-w-[22rem] overflow-y-auto bg-gray-900 p-6 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="flex flex-col gap-6">
                            <Link href="/" onClick={() => setMenuOpen(false)}>
                                Home
                            </Link>

                            <Link
                                href="/contactus"
                                onClick={() => setMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            <Link
                                href="/catalog"
                                onClick={() => setMenuOpen(false)}
                                className="rounded-full bg-cyan-500 px-4 py-2 text-center font-semibold"
                            >
                                Browse Catalog
                            </Link>

                            {/* -------- Auth (Mobile) -------- */}
                            {!auth.user ? (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-center text-sm font-medium text-white/90 hover:text-white"
                                >
                                    Login
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-center text-sm font-medium text-white/90 hover:text-white"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        onClick={() => setMenuOpen(false)}
                                        className="text-center text-sm font-medium text-red-400 hover:text-red-300"
                                    >
                                        Logout
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}

            {/* ================= CART ================= */}
            {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
        </>
    );
}
