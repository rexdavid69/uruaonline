import AppLogo from "@/components/app-logo";
import { type SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  User,
  ClipboardList,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface UserLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function UserLayout({ children, title }: UserLayoutProps) {
  const page = usePage<SharedData>();
  const user = page.props?.auth?.user ?? null;

  const currentPath = useMemo(() => page.url.split("?")[0], [page.url]);
  const isSettingsRoute = currentPath.startsWith("/settings");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ✅ Auto-open settings when you land on /settings/*
  useEffect(() => {
    if (isSettingsRoute) setSettingsOpen(true);
  }, [isSettingsRoute]);

  // Close mobile sidebar on ESC
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function isActivePath(href: string) {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  }

  function NavItem({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    label: string;
  }) {
    const active = isActivePath(href);

    return (
      <Link
        href={href}
        title={sidebarCollapsed ? label : undefined}
        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
          ${
            active
              ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300"
              : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
          }
          ${sidebarCollapsed ? "justify-center px-3" : ""}`}
      >
        <Icon
          className={`h-5 w-5 transition
            ${
              active
                ? "text-cyan-600 dark:text-cyan-300"
                : "text-slate-400 group-hover:text-cyan-600 dark:text-slate-400 dark:group-hover:text-cyan-300"
            }`}
        />
        {!sidebarCollapsed && <span>{label}</span>}
      </Link>
    );
  }

  function SettingsLink({ href, label }: { href: string; label: string }) {
    const active = currentPath === href;
    return (
      <Link
        href={href}
        className={`rounded-lg px-4 py-2 text-sm transition
          ${
            active
              ? "bg-slate-100 text-slate-900 dark:bg-gray-800 dark:text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
          }`}
      >
        {label}
      </Link>
    );
  }

  const sidebarInner = (
    <>
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <Link
          href="/"
          aria-label="Go to homepage"
          className="flex items-center gap-2"
        >
          <AppLogo size="h-14 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
        <NavItem href="/catalog" icon={Package} label="Catalog" />
        <NavItem href="/cart" icon={ShoppingCart} label="My Cart" />
        <NavItem href="/my-orders" icon={ClipboardList} label="Orders" />
        <NavItem href="/my-quotes" icon={FileText} label="My Quotes" />

        <div className="my-4 border-t border-slate-200 dark:border-gray-800" />

        {/* Settings dropdown */}
        <button
          onClick={() => setSettingsOpen((v) => !v)}
          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition
            ${
              isSettingsRoute
                ? "bg-slate-100 text-slate-900 dark:bg-gray-800 dark:text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
            }
            ${sidebarCollapsed ? "px-3 justify-center" : ""}`}
          title={sidebarCollapsed ? "Settings" : undefined}
        >
          <span
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Settings className="h-5 w-5 text-slate-400" />
            {!sidebarCollapsed && "Settings"}
          </span>

          {!sidebarCollapsed && (
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {settingsOpen && !sidebarCollapsed && (
          <div className="ml-6 mt-2 flex flex-col gap-1">
            <SettingsLink href="/settings/profile" label="Profile" />
            <SettingsLink href="/settings/account" label="Account" />
            <SettingsLink href="/settings/security" label="Security" />
          </div>
        )}
      </nav>

      {/* Footer user info */}
      {!sidebarCollapsed && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user ? "Account" : "Not signed in"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-slate-200 bg-white px-4 py-6 shadow-sm transition-transform md:hidden dark:border-gray-800 dark:bg-gray-900 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Menu
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-gray-800"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sidebarInner}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-col border-r border-slate-200 bg-white py-6 shadow-sm md:flex dark:border-gray-800 dark:bg-gray-900 transition-all ${
          sidebarCollapsed ? "w-20 px-2" : "w-72 px-4"
        }`}
      >
        {sidebarInner}
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            {/* Mobile open */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-slate-100 md:hidden dark:hover:bg-gray-800"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop collapse */}
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="hidden items-center justify-center rounded-xl p-2 hover:bg-slate-100 md:inline-flex dark:hover:bg-gray-800"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {title ?? "Dashboard"}
            </h1>
          </div>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
            >
              <User className="h-5 w-5" />
              {user ? user.name : "Guest"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                {user ? (
                  <>
                    <Link
                      href="/settings/profile"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-800"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-gray-800"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-gray-800"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
