import AppLogoIcon from "@/components/app-logo-icon";
import { home } from "@/routes";
import { Link } from "@inertiajs/react";
import { type PropsWithChildren } from "react";

export default function AuthCardLayout({
  children,
  title,
  description,
}: PropsWithChildren<{
  name?: string;
  title?: string;
  description?: string;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link href={home()} aria-label="Go to homepage" className="group">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur transition group-hover:scale-105">
              <AppLogoIcon className="h-10 w-10 text-white" />
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* tiny footer */}
        <p className="mt-5 text-center text-xs text-slate-400">
          UruaOnline • Secure authentication
        </p>
      </div>
    </div>
  );
}
