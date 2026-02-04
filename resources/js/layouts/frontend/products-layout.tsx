import React from "react";

type ProductLayoutProps = {
  /** Optional header area that spans full width (e.g., Producer hero section) */
  header?: React.ReactNode;

  /** Left sidebar content (search, filters, category links) */
  sidebar: React.ReactNode;

  /** Main content (product grid, grouped categories, etc.) */
  children: React.ReactNode;

  /** Optional class tweaks */
  className?: string;
};

export default function ProductLayout({
  header,
  sidebar,
  children,
  className = "",
}: ProductLayoutProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Full-width header (optional) */}
      {header && <div className="w-full">{header}</div>}

      {/* Body */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/*
            On desktop: 280px sidebar + flexible main
            On mobile: stacked
          */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              {/*
                Card-like container for sidebar tools.
                You can remove bg/border if you want it more minimal.
              */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {sidebar}
              </div>
            </aside>

            {/* Main */}
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </section>
    </div>
  );
}
