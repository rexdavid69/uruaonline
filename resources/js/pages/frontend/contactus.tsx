import Publiclayout from "@/layouts/publiclayout";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <Publiclayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-cyan-700 to-blue-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-cyan-100 md:text-xl">
              For product inquiries, quotations, or support — our team is ready
              to help.
            </p>
          </div>
        </div>

        {/* subtle glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left: Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Get in touch
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Visit our office, call us directly, or send an email. For
                  quotations, include product name, model/MPN, and quantity.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-1 h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Phone
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        0803 255 7089<br />
                        0902 384 319
                      </p>
                      <div className="mt-2 space-x-3 text-sm font-semibold">
                        <a
                          href="tel:+2348032557089"
                          className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                        >
                          Call 1 →
                        </a>
                        <a
                          href="tel:+234902384319"
                          className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                        >
                          Call 2 →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Email
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        info@silpan-ng.com<br />
                        emirate3@yahoo.com
                      </p>
                      <div className="mt-2 space-x-3 text-sm font-semibold">
                        <a
                          href="mailto:info@silpan-ng.com"
                          className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                        >
                          Email 1 →
                        </a>
                        <a
                          href="mailto:emirate3@yahoo.com"
                          className="text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                        >
                          Email 2 →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Office Address
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Favour Award Shopping Mall<br />
                        No. 30 Okporo Road, Rumuogba<br />
                        Port Harcourt, Rivers State
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          document
                            .getElementById("map")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="mt-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                      >
                        View map →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:col-span-2">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Business Hours
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Monday – Friday<br />
                        9:00am – 5:00pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-slate-700 dark:border-cyan-900/40 dark:bg-cyan-900/20 dark:text-slate-200">
                <p className="text-sm">
                  <span className="font-semibold">Tip:</span> For faster
                  quotations, include <span className="font-semibold">product
                  name, model/MPN</span> and <span className="font-semibold">
                  quantity</span>.
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Send a message
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                We typically respond within one business day.
              </p>

              <form className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Tell us what you need…"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="px-6 py-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Our Location
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Favour Award Shopping Mall, No. 30 Okporo Rd, Rumuogba, Port Harcourt
              </p>
            </div>

            <div className="h-[360px] w-full">

              <iframe
                title="Silpan Nigeria Location"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Rumuogba%20Port%20Harcourt&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
              
            </div>
          </div>
        </div>
      </section>
    </Publiclayout>
  );
}
