/* eslint-disable @typescript-eslint/no-explicit-any */
import Publiclayout from '@/layouts/publiclayout';
import { usePage, Link } from '@inertiajs/react';
import LazyImage from "@/components/lazy-images";   // ← IMPORTANT: added lazy loader

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
    const producers = (props.producers || []).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';
    const getImageUrl = (path?: string) => {
        if (!path) return null; // ← return null instead of empty string
        if (path.startsWith('http')) return path;
        return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, '')}`;
    };
    

    return (
        <Publiclayout>
            <section className="container mx-auto px-6 py-12">
                <h1 className="text-left text-3xl font-bold text-cyan-800 uppercase dark:text-cyan-300">
                    Catalog
                </h1>

                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {producers.map(producer => (
                        <Link
                            key={producer.id}
                            href={`/producer/${producer.id}/products`}
                            className="flex flex-col items-center rounded-xl p-4 transition-transform duration-300 group"
                        >
                            {producer.logo && getImageUrl(producer.logo) && (
    <LazyImage
        src={getImageUrl(producer.logo)}
        alt={producer.name}
        className="h-32 w-32 object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
    />
)}

                            <h3 className="mt-4 text-lg text-black dark:text-white transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-200">
                                {producer.name.toUpperCase()}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>
        </Publiclayout>
    );
}
