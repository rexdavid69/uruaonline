import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import { Link } from "@inertiajs/react";
import { type PropsWithChildren } from "react";

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Subtle gradient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900 md:p-10">
        <div className="flex flex-col gap-8">
          {/* Logo + Header */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href={home()}
              className="group flex items-center justify-center"
              aria-label="Go to homepage"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 shadow-sm transition-all duration-300 group-hover:scale-105 dark:bg-gray-800">
                <AppLogoIcon className="h-12 w-12 text-slate-900 dark:text-white" />
              </div>
            </Link>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Form slot */}
          {children}
        </div>
      </div>
    </div>
  );
}
