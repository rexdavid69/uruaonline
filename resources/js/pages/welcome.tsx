import HeroCarousel from '@/components/frontend/hero-carousel';
import PublicLayout from '@/layouts/publiclayout';
import { Link } from '@inertiajs/react';
import { Network, ShieldCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Producer {
    id: number;
    name: string;
    logo?: string;
}

export default function Welcome() {
    const [producers, setProducers] = useState<Producer[]>([]);
    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

    const getImageUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, '')}`;
    };

    useEffect(() => {
        fetch('/api/public/producers')
            .then((res) => res.json())
            .then((data) => {
                if (!data.producers) return;
                const sorted = (data.producers as Producer[])
                    .filter((p) => p.logo)
                    .slice(0, 8);
                setProducers(sorted);
            })
            .catch(() => {});
    }, []);

    const heroImages = [
        '/images/hero-1.jpg',
        '/images/hero-2.jpg',
        '/images/hero-3.jpg',
    ];

    return (
        <PublicLayout>
            {/* ================= HERO ================= */}
            <section className="relative min-h-[85vh] bg-slate-900 text-white">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <HeroCarousel images={heroImages} />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 mx-auto flex max-w-7xl items-center px-6 py-32">
                    <div className="max-w-2xl">
                        <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-6xl">
                            Enterprise & Marine
                            <span className="block text-cyan-400">
                                Connectivity Solutions
                            </span>
                        </h1>

                        <p className="mb-10 text-lg text-slate-200 md:text-xl">
                            Satellite, cellular, RF and networking equipment
                            from globally trusted manufacturers — engineered for
                            mission-critical environments.
                        </p>

                        <Link
                            href="/contactus"
                            className="inline-flex items-center rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-cyan-600"
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= TRUST / PRODUCERS ================= */}
            <section className="bg-slate-50 py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="mb-4 text-center text-4xl font-bold text-slate-900 dark:text-white">
                        Trusted by Global Technology Leaders
                    </h2>
                    <p className="mb-14 text-center text-slate-600 dark:text-slate-400">
                        Authorized distributor of enterprise and marine-grade
                        brands
                    </p>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
                        {producers.map((producer) => {
                            const logo = getImageUrl(producer.logo);
                            if (!logo) return null;

                            return (
                                <Link
                                    key={producer.id}
                                    href={`/producer/${producer.id}/products`}
                                    className="group flex h-28 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                                >
                                    <img
                                        src={logo}
                                        alt={producer.name}
                                        className="max-h-16 opacity-70 transition group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            href="/catalog"
                            className="rounded-full bg-cyan-600 px-8 py-3 font-semibold text-white transition hover:bg-cyan-700"
                        >
                            View Full Catalog
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= VALUE PROPOSITION ================= */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <h2 className="mb-16 text-center text-4xl font-bold text-slate-900 dark:text-white">
                        Why Choose UruaOnline
                    </h2>

                    <div className="grid gap-10 md:grid-cols-3">
                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                            <ShieldCheck className="mb-4 h-10 w-10 text-cyan-600" />
                            <h3 className="mb-2 text-xl font-semibold">
                                Authorized Distribution
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                We partner directly with leading manufacturers
                                to ensure genuine, certified products.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                            <Network className="mb-4 h-10 w-10 text-cyan-600" />
                            <h3 className="mb-2 text-xl font-semibold">
                                Enterprise-Grade Solutions
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Built for marine, industrial and
                                mission-critical environments.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                            <Truck className="mb-4 h-10 w-10 text-cyan-600" />
                            <h3 className="mb-2 text-xl font-semibold">
                                Reliable Local Delivery
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Fast procurement and dependable logistics
                                tailored to your region.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
