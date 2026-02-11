/* eslint-disable @typescript-eslint/no-explicit-any */
import PublicLayout from "@/layouts/publiclayout";
import { usePage, Link } from "@inertiajs/react";
import LazyImage from "@/components/lazy-images";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface Producer {
  id: number;
  name: string;
  logo?: string;
}

interface PageProps {
  producers: Producer[];
  [key: string]: any;
}

export default function CatalogPage() {
  const { props } = usePage<PageProps>();
  const [q, setQ] = useState("");

const APP_URL = (import.meta.env.VITE_APP_URL as string) || window.location.origin;
 const getImageUrl = (path?: string) => {
  if (!path) return '';

  // already absolute (http/https)
  if (/^https?:\/\//i.test(path)) return path;

  // normalize common storage path formats coming from API/DB
  const clean = path.replace(/^\/+/, '').replace(/^storage\//, '');

  // if your DB sometimes stores "producers/xxx.png"
  // or "storage/producers/xxx.png"
  return `${APP_URL}/storage/${clean}`;
};



  const producers = useMemo(() => {
    const list = (props.producers || [])
      .filter((p) => p?.name) // safety
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!q.trim()) return list;

    const query = q.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(query));
  }, [props.producers, q]);

  return (
    <PublicLayout>
      {/* Header */}
      <section className="bg-slate-50 py-14 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                Catalog
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Browse producers and explore their available products.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-[360px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search producers…"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-cyan-900/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {producers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
              No producers found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {producers.map((producer) => {
                const logo = getImageUrl(producer.logo);

                return (
                  <Link
                    key={producer.id}
                    href={`/producer/${producer.id}/products`}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    {/* Logo */}
                    <div className="flex h-20 items-center justify-center">
                      {logo ? (
                        <LazyImage
                          src={logo}
                          alt={producer.name}
                          className="max-h-16 w-auto object-contain opacity-80 transition group-hover:opacity-100"
                        />
                      ) : (
                        <div className="text-sm text-slate-400">
                          No logo available
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="mt-5 text-center text-base font-semibold text-slate-900 transition group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                      {producer.name}
                    </h3>

                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
