import { Link } from "@inertiajs/react";
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white text-slate-700 dark:from-gray-900 dark:to-gray-950 dark:text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="UruaOnline home">
              <img
                src="/uruaonline_logo_full.png"
                alt="UruaOnline"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Enterprise & marine connectivity solutions — satellite, cellular,
              RF and networking equipment from globally trusted manufacturers.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-cyan-300 hover:text-cyan-600 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-cyan-300 hover:text-cyan-600 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:border-cyan-300 hover:text-cyan-600 transition dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/catalog" className="text-slate-600 hover:text-cyan-700 transition dark:text-slate-400 dark:hover:text-cyan-300">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/aboutus" className="text-slate-600 hover:text-cyan-700 transition dark:text-slate-400 dark:hover:text-cyan-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="text-slate-600 hover:text-cyan-700 transition dark:text-slate-400 dark:hover:text-cyan-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>



          {/* Soft CTA */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Need guidance?
            </h3>

            <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Not sure what fits your environment? Get recommendations from our
              team in minutes.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contactus"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Get Expert Advice
              </Link>

              <Link
                href="/catalog"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-800 hover:border-cyan-300 hover:text-cyan-700 transition dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-slate-200 pt-6 text-xs text-center text-slate-500 dark:border-white/10 dark:text-slate-500">
          © {year} UruaOnline. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
