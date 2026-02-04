import Publiclayout from "@/layouts/publiclayout";
import { ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AboutPage() {
  return (
    <Publiclayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-cyan-700 to-blue-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wider text-cyan-200">
              ABOUT US
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">
              About UruaOnline
            </h1>
            <p className="mt-5 text-lg text-cyan-100 md:text-xl">
              UruaOnline connects businesses and individuals with cutting-edge
              technology solutions — reliable products, trusted brands, and
              support you can count on.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Browse Catalog <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* soft glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      </section>

      {/* Mission / Vision */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Our Mission
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                To deliver high-quality tech solutions that meet the unique
                needs of every customer. We simplify technology and make it easy
                to adopt and use.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Our Vision
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                To be a leading technology solutions provider known for
                innovation, reliability, and exceptional customer service — where
                technology seamlessly enhances daily life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Choose UruaOnline?
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Trusted brands, clean procurement, and support you can rely on.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reliable Products
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                We supply trusted brands with quality you can depend on — built
                for real-world use.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Innovative Solutions
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                From connectivity to navigation and tracking — we help you adopt
                modern technology efficiently.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Focused
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                We prioritize responsive support, helpful guidance, and smooth
                purchasing from start to finish.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row dark:border-gray-700 dark:bg-gray-900">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                Ready to explore our products?
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Browse the catalog or request a quote — we’ll help you choose the
                right solution.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/catalog"
                className="rounded-2xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Browse Catalog
              </Link>
              <Link
                href="/contactus"
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Publiclayout>
  );
}
