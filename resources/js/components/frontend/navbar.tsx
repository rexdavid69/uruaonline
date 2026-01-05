/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppearance } from "@/hooks/use-appearance";
import { type SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  ChevronDown,
  Home,
  Moon,
  Package,
  Phone,
  Sun,
  User,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AppLogo from "../app-logo";
import CartDrawer from "@/components/frontend/cart-drawer";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { appearance, updateAppearance } = useAppearance();
  const { url, props } = usePage<SharedData>();
  const { auth } = props;

  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.cart)
        ? data.cart
        : Array.isArray(data.items)
        ? data.items
        : [];
      const total = items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0
      );
      setCartCount(total);
    } catch (error) {
      console.error("Cart count fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [cartOpen]);

  const toggleTheme = () => {
    updateAppearance(appearance === "light" ? "dark" : "light");
  };

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: Package },
    { href: "/contactus", label: "Contact", icon: Phone },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-cyan-600 to-blue-900 py-2 shadow-md"
            : "bg-gradient-to-r from-cyan-700 to-blue-950 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" aria-label="Go to homepage">
              <AppLogo size="h-20 w-auto" />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden lg:flex items-center space-x-10 text-white font-semibold uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 border-b-2 pb-1 transition-colors ${
                  url === link.href
                    ? "border-white text-cyan-200"
                    : "border-transparent hover:border-cyan-200 hover:text-cyan-100"
                }`}
              >
                <link.icon className="h-6 w-6 text-cyan-200" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Icons and Auth */}
          <div className="hidden lg:flex items-center gap-6 text-white">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-cyan-200 transition"
            >
              <ShoppingCart className="h-7 w-7" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {!auth.user ? (
              <Link
                href="/login"
                className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-white transition hover:bg-cyan-600"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 font-semibold text-white focus:outline-none"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                >
                  <User className="h-7 w-7" />
                  <span>{auth.user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white text-gray-800 shadow-lg">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light / Dark Mode"
              className="rounded-full p-2 text-white transition hover:bg-cyan-800/30"
            >
              {appearance === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6 text-yellow-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-cyan-200"
            >
              <ShoppingCart className="h-7 w-7" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Light / Dark Mode"
              className="rounded-full p-2 text-white transition hover:bg-cyan-800/30"
            >
              {appearance === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6 text-yellow-300" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="rounded-md p-2 text-white transition hover:bg-cyan-800/30"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="absolute top-0 right-0 h-full w-64 space-y-6 bg-gradient-to-b from-cyan-700 to-blue-950 p-6 text-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-lg font-semibold transition ${
                    url === link.href
                      ? "text-cyan-200"
                      : "hover:text-cyan-300"
                  }`}
                >
                  <link.icon className="h-6 w-6 text-cyan-300" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {!auth.user ? (
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="rounded-md bg-cyan-500 px-4 py-2 text-center font-semibold text-white"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-cyan-500 px-4 py-2 text-center font-semibold text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="rounded-md border border-white px-4 py-2 text-center font-semibold text-white"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 🛒 Cart Drawer */}
      {cartOpen && (
        <CartDrawer onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}
