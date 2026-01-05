import { useEffect, useRef, useState } from "react";

interface LazyImageProps {
    src: string | null;
    alt: string;
    className?: string;
}

export default function LazyImage({ src, alt, className }: LazyImageProps) {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

    // If src is null → don't render anything
    if (!src) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setLoadedSrc(src);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: "200px" }
        );

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={loadedSrc ?? undefined}
            alt={alt}
            className={className}
        />
    );
}
