import { ReactNode, useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  ChevronDown,
  UserCog,
  Sun,
  Moon,
  User,
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface BackendLayoutProps {
  children: ReactNode;
  title?: string;
}

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function BackendLayout({ children }: BackendLayoutProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [productsOpen, setProductsOpen] = useState(false);

  const { props } = usePage<PageProps>();
  const username = props.auth?.user?.name || "Admin";

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm flex flex-col transition-colors duration-300">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center h-20 border-b dark:border-gray-700">
          <Link href="/backend/dashboard" aria-label="Go to Admin Dashboard">
            <AppLogo size="h-14 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/backend/dashboard"
            className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>

          <Link
            href="/backend/users"
            className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="w-5 h-5" /> Users
          </Link>

          {/* Products Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex w-full items-center justify-between p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" /> Products
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`ml-6 overflow-hidden transition-all duration-300 ${
                productsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <Link
                href="/backend/products"
                className="block p-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                All Products
              </Link>
              <Link
                href="/backend/producers"
                className="block p-2 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Producers
              </Link>
            </div>
          </div>

          <Link
            href="/backend/orders"
            className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>

          <Link
            href="/backend/settings"
            className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 shadow-sm relative transition-colors duration-300">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100"></h1>

          <div className="flex items-center gap-4">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <UserCog className="w-5 h-5" />
                <span className="font-medium">Welcome, {username}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <Link
                    href="/backend/logout"
                    method="post"
                    as="button"
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
