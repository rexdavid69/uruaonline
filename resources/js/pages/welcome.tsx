import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import Publiclayout from "@/layouts/publiclayout";
import HeroCarousel from "@/components/frontend/hero-carousel";

interface Producer {
  id: number;
  name: string;
  logo?: string;
}

export default function Welcome() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const APP_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, "")}`;
  };

  useEffect(() => {
    fetch("/api/public/producers")
      .then((res) => res.json())
      .then((data) => {
        if (!data.producers) return;
        const sortedProducers = (data.producers as Producer[])
          .filter((p) => p.name) // only valid producers
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8);
        setProducers(sortedProducers);
      })
      .catch((err) => console.error("Error fetching producers:", err));
  }, []);

  const heroImages = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
    "/images/hero-4.png",
  ];

  return (
    <Publiclayout>
      {/* Hero Carousel */}
      <HeroCarousel images={heroImages} />

      {/* Producers Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-extrabold text-cyan-800 dark:text-cyan-300">
          Proud Distributors of
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {producers.map((producer) => {
            const producerLogo = getImageUrl(producer.logo);
            if (!producerLogo) return null; // Skip if no logo

            return (
              <Link
                key={producer.id}
                href={`/producer/${producer.id}/products`}
                className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg dark:bg-cyan-950"
              >
                <img
                  src={producerLogo}
                  alt={producer.name}
                  className="max-h-20 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/catalog"
            className="rounded-lg bg-cyan-600 px-6 py-3 text-white font-semibold hover:bg-cyan-700 transition"
          >
            View All
          </Link>
        </div>
      </section>
    </Publiclayout>
  );
}
