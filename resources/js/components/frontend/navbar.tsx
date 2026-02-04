/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppearance } from "@/hooks/use-appearance";
import { type SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  ChevronDown,
  Moon,
  Sun,
  User,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AppLogo from "../app-logo";
import CartDrawer from "@/components/frontend/cart-drawer";

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
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data?.cart) ? data.cart : [];
        const total = items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 0),
          0
        );
        setCartCount(total);
      })
      .catch(() => {});
  }, [cartOpen]);

  /* ---------------- Scroll Effect ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    updateAppearance(appearance === "light" ? "dark" : "light");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80"
            : "bg-gradient-to-r from-cyan-700 to-blue-950"
        }`}
      >
        <div className="mx-auto flex h-25 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" aria-label="UruaOnline Home">
            <AppLogo size="h-30 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                url === "/" ? "text-cyan-400" : "text-white hover:text-cyan-300"
              }`}
            >
              Home
            </Link>

            <Link
              href="/contactus"
              className={`text-sm font-medium transition ${
                url === "/contactus"
                  ? "text-cyan-400"
                  : "text-white hover:text-cyan-300"
              }`}
            >
              Contact
            </Link>

            {/* Primary CTA */}
            <Link
              href="/catalog"
              className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 transition"
            >
              Browse Catalog
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-white hover:text-cyan-300 transition"
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
                className="text-sm font-medium text-white hover:text-cyan-300 transition"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-cyan-300 transition"
                >
                  <User className="h-5 w-5" />
                  {auth.user.name}
                  <ChevronDown
                    className={`h-4 w-4 transition ${
                      dropdownOpen ? "rotate-180" : ""
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
              className="rounded-full p-2 text-white hover:bg-white/10 transition"
            >
              {appearance === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-300" />
              )}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative text-white">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              {menuOpen ? <X /> : <span className="text-xl">☰</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-900 p-6 text-white">
            <nav className="flex flex-col gap-6">
              <Link href="/">Home</Link>
              <Link href="/contactus">Contact</Link>
              <Link
                href="/catalog"
                className="rounded-full bg-cyan-500 px-4 py-2 text-center font-semibold"
              >
                Browse Catalog
              </Link>
            </nav>
          </div>
        </div>
      )}

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
