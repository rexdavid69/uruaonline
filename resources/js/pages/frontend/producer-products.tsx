/* eslint-disable @typescript-eslint/no-explicit-any */
import LazyImage from '@/components/lazy-images';
import ProductsLayout from '@/layouts/frontend/products-layout';
import Publiclayout from '@/layouts/publiclayout';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Info, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Producer {
    id: number;
    name: string;
    logo?: string;
    description?: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | null; // ✅ RFQ default support
    image?: string;
    stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
    sku?: string;
    mpn?: string;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export default function ProducerProducts() {
    const { props } = usePage<any>();
    const producerId = props.producerId;

    const [producer, setProducer] = useState<Producer | null>(null);
    const [groupedCategories, setGroupedCategories] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const [feedback, setFeedback] = useState<Feedback>(null);

    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingProductData, setLoadingProductData] = useState(false);
    const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');

    const [q, setQ] = useState('');

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



    // ✅ RFQ helpers
    const isRFQ = (price: any) =>
        price === null || price === undefined || Number(price) <= 0;

    const formatNaira = (price: any) => `₦${Number(price).toLocaleString()}`;

    // -------- Fetch producer + products --------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/public/producer/${producerId}/products`,
                );
                const data = await res.json();
                if (res.ok) {
                    setProducer(data.producer);
                    setGroupedCategories(data.groupedCategories || {});
                } else {
                    setFeedback({
                        type: 'error',
                        message: data.message || 'Failed to load products.',
                    });
                }
            } catch (error) {
                console.error(error);
                setFeedback({
                    type: 'error',
                    message: 'Network error loading products.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [producerId]);

    // -------- Modal UX: lock scroll + close on ESC --------
    useEffect(() => {
        if (!modalOpen) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setModalOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [modalOpen]);

    // -------- Add to cart --------
    const handleAddToCart = async (productId: number, stock_status: string) => {
        // keep logic, remove UI
        if (stock_status === 'out_of_stock') {
            setFeedback({
                type: 'error',
                message: 'This item is currently unavailable.',
            });
            setTimeout(() => setFeedback(null), 2500);
            return;
        }

        setFeedback(null);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const data = await response.json();

            setFeedback({
                type: response.ok ? 'success' : 'error',
                message:
                    data.message ||
                    (response.ok ? 'Added to cart!' : 'Failed to add.'),
            });
        } catch {
            setFeedback({
                type: 'error',
                message: 'An error occurred. Please try again.',
            });
        } finally {
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    // -------- View specs & features --------
    const handleViewProductData = async (productId: number) => {
        setLoadingProductData(true);
        setModalOpen(true);
        setActiveTab('specs');
        setSelectedProduct(null);

        try {
            const [specsRes, featuresRes] = await Promise.all([
                fetch(`/api/products/${productId}/specs`),
                fetch(`/api/products/${productId}/features`),
            ]);
            const specsData = await specsRes.json();
            const featuresData = await featuresRes.json();

            setSelectedProduct({
                ...specsData,
                features: featuresData.features || [],
            });
        } catch {
            setSelectedProduct({ error: 'Failed to load product data' });
        } finally {
            setLoadingProductData(false);
        }
    };

    // -------- Filter products by query --------
    const filteredGrouped = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return groupedCategories;

        const out: any = {};
        for (const [categoryName, subcats] of Object.entries(
            groupedCategories || {},
        )) {
            const newSubcats: any = {};
            for (const [subName, products] of Object.entries(subcats as any)) {
                const list = Array.isArray(products) ? products : [];
                const filtered = list.filter((p: Product) => {
                    const hay = [
                        p.name,
                        p.description,
                        p.sku || '',
                        p.mpn || '',
                    ]
                        .join(' ')
                        .toLowerCase();
                    return hay.includes(query);
                });

                if (filtered.length) newSubcats[subName] = filtered;
            }
            if (Object.keys(newSubcats).length) out[categoryName] = newSubcats;
        }
        return out;
    }, [groupedCategories, q]);

    const hasProducts = Object.keys(filteredGrouped || {}).length > 0;

    // Build sidebar jump links from filtered results (so it stays consistent with search)
    const navTree = useMemo(() => {
        const tree: Array<{ category: string; subs: string[] }> = [];

        for (const [categoryName, subcats] of Object.entries(
            filteredGrouped || {},
        )) {
            const subs = Object.keys(subcats as any);
            tree.push({ category: categoryName, subs });
        }

        return tree;
    }, [filteredGrouped]);

    if (loading) {
        return (
            <Publiclayout>
                <div className="py-20 text-center text-slate-500 dark:text-slate-300">
                    Loading products…
                </div>
            </Publiclayout>
        );
    }

    // ================= HEADER (goes into ProductsLayout.header) =================
    const header = producer ? (
        <section className="bg-slate-50 py-14 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center gap-6 text-center">
                    {producer.logo && getImageUrl(producer.logo) && (
                        <LazyImage
                            src={getImageUrl(producer.logo)}
                            alt={producer.name}
                            className="h-20 w-auto object-contain"
                        />
                    )}

                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        {producer.name}
                    </h1>

                    {producer.description ? (
                        <p className="max-w-3xl text-slate-600 dark:text-slate-400">
                            {producer.description}
                        </p>
                    ) : (
                        <p className="max-w-3xl text-slate-500 dark:text-slate-400">
                            Browse products by {producer.name}.
                        </p>
                    )}
                </div>
            </div>
        </section>
    ) : null;

    // ================= SIDEBAR (goes into ProductsLayout.sidebar) =================
    const sidebar = (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Name, SKU, MPN…"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-3 pl-10 text-slate-900 shadow-sm transition outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-cyan-900/40"
                    />
                </div>
                {q.trim() && (
                    <button
                        onClick={() => setQ('')}
                        className="mt-2 text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300"
                    >
                        Clear search
                    </button>
                )}
            </div>

            {/* Jump links */}
            <div>
                <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Categories
                </p>

                {!hasProducts ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No matching products.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {navTree.map(({ category, subs }) => {
                            const catId = `cat-${slugify(category)}`;
                            return (
                                <div key={category} className="space-y-2">
                                    <a
                                        href={`#${catId}`}
                                        className="block text-sm font-semibold text-slate-700 hover:text-cyan-700 dark:text-slate-200 dark:hover:text-cyan-300"
                                    >
                                        {category}
                                    </a>

                                    {subs.length > 0 && (
                                        <div className="space-y-1 pl-3">
                                            {subs.map((sub) => {
                                                const subId = `sub-${slugify(category)}-${slugify(sub)}`;
                                                return (
                                                    <a
                                                        key={sub}
                                                        href={`#${subId}`}
                                                        className="block text-sm text-slate-600 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300"
                                                    >
                                                        {sub}
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Publiclayout>
            <ProductsLayout header={header} sidebar={sidebar}>
                {/* ================= MAIN CONTENT ================= */}
                {!hasProducts ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-slate-300">
                        No products found.
                    </div>
                ) : (
                    <div className="space-y-14">
                        {Object.entries(filteredGrouped).map(
                            ([categoryName, subcats]: [string, any]) => {
                                const catId = `cat-${slugify(categoryName)}`;

                                return (
                                    <div
                                        key={categoryName}
                                        id={catId}
                                        className="scroll-mt-24"
                                    >
                                        <div className="mb-6 flex items-end justify-between gap-4">
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {categoryName}
                                            </h2>
                                        </div>

                                        <div className="space-y-10">
                                            {Object.entries(
                                                subcats as Record<
                                                    string,
                                                    Product[]
                                                >,
                                            ).map(([subName, products]) => {
                                                const subId = `sub-${slugify(categoryName)}-${slugify(subName)}`;

                                                return (
                                                    <div
                                                        key={subName}
                                                        id={subId}
                                                        className="scroll-mt-24"
                                                    >
                                                        <h3 className="mb-4 text-lg font-semibold text-cyan-700 dark:text-cyan-300">
                                                            {subName}
                                                        </h3>

                                                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                            {Array.isArray(
                                                                products,
                                                            ) &&
                                                                products.map(
                                                                    (
                                                                        product,
                                                                    ) => {
                                                                        const img =
                                                                            product.image
                                                                                ? getImageUrl(
                                                                                      product.image,
                                                                                  )
                                                                                : '';

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    product.id
                                                                                }
                                                                                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                                                            >
                                                                                {/* Image */}
                                                                                <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-gray-900">
                                                                                    {img ? (
                                                                                        <LazyImage
                                                                                            src={
                                                                                                img
                                                                                            }
                                                                                            alt={
                                                                                                product.name
                                                                                            }
                                                                                            className="max-h-40 w-auto object-contain transition group-hover:scale-105"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                                                            <Info className="h-4 w-4" />
                                                                                            <span>
                                                                                                No
                                                                                                image
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* Content */}
                                                                                <div className="mt-4 flex flex-1 flex-col">
                                                                                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                                                                                        {
                                                                                            product.name
                                                                                        }
                                                                                    </h4>

                                                                                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                                                                        {
                                                                                            product.description
                                                                                        }
                                                                                    </p>

                                                                                    {/* ✅ Price / RFQ */}
                                                                                    <div className="mt-3">
                                                                                        {isRFQ(
                                                                                            product.price,
                                                                                        ) ? (
                                                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                                                                Request
                                                                                                for
                                                                                                Quote
                                                                                            </p>
                                                                                        ) : (
                                                                                            <p className="text-lg font-extrabold text-cyan-600 dark:text-cyan-300">
                                                                                                {formatNaira(
                                                                                                    product.price,
                                                                                                )}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* ✅ Actions */}
                                                                                    <div className="mt-4 flex gap-2">
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleViewProductData(
                                                                                                    product.id,
                                                                                                )
                                                                                            }
                                                                                            className="flex-1 rounded-xl border border-cyan-600 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
                                                                                        >
                                                                                            View
                                                                                            details
                                                                                        </button>

                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleAddToCart(
                                                                                                    product.id,
                                                                                                    product.stock_status,
                                                                                                )
                                                                                            }
                                                                                            className="flex-1 rounded-xl bg-cyan-600 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                                                                                        >
                                                                                            Add
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    },
                                                                )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                )}
            </ProductsLayout>

            {/* ================= MODAL ================= */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    onClick={() => setModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-gray-700">
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                                    {selectedProduct?.name || 'Product details'}
                                </h2>
                                {selectedProduct?.sku ||
                                selectedProduct?.mpn ? (
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {selectedProduct?.sku
                                            ? `SKU: ${selectedProduct.sku}`
                                            : ''}
                                        {selectedProduct?.sku &&
                                        selectedProduct?.mpn
                                            ? ' • '
                                            : ''}
                                        {selectedProduct?.mpn
                                            ? `MPN: ${selectedProduct.mpn}`
                                            : ''}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-gray-800"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[80vh] overflow-y-auto">
                            {loadingProductData ? (
                                <div className="p-10 text-center text-slate-600 dark:text-slate-300">
                                    Loading product…
                                </div>
                            ) : selectedProduct?.error ? (
                                <div className="p-10 text-center text-red-500">
                                    {selectedProduct.error}
                                </div>
                            ) : selectedProduct ? (
                                <div className="grid gap-8 p-6 md:grid-cols-2">
                                    {/* Left: Image */}
                                    <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-4 dark:bg-gray-800">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="max-h-[420px] w-full object-contain"
                                        />
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex flex-col">
                                        {selectedProduct?.description ? (
                                            <p className="text-slate-600 dark:text-slate-300">
                                                {selectedProduct.description}
                                            </p>
                                        ) : (
                                            <p className="text-slate-500 dark:text-slate-400">
                                                No description available.
                                            </p>
                                        )}

                                        {/* ✅ Price / RFQ */}
                                        <div className="mt-5">
                                            {isRFQ(selectedProduct.price) ? (
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    Request for Quote
                                                </p>
                                            ) : (
                                                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-300">
                                                    {formatNaira(
                                                        selectedProduct.price,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* Tabs */}
                                        <div className="mt-6 border-b border-slate-200 dark:border-gray-700">
                                            <div className="flex gap-6">
                                                <button
                                                    onClick={() =>
                                                        setActiveTab('specs')
                                                    }
                                                    className={`py-3 text-sm font-semibold transition ${
                                                        activeTab === 'specs'
                                                            ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-300'
                                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Specifications
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setActiveTab('features')
                                                    }
                                                    className={`py-3 text-sm font-semibold transition ${
                                                        activeTab === 'features'
                                                            ? 'border-b-2 border-cyan-600 text-cyan-600 dark:text-cyan-300'
                                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                                    }`}
                                                >
                                                    Features
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tab content */}
                                        <div className="mt-4 flex-1">
                                            {activeTab === 'specs' ? (
                                                <div className="space-y-2">
                                                    {selectedProduct.specifications &&
                                                    Object.keys(
                                                        selectedProduct.specifications,
                                                    ).length ? (
                                                        Object.entries(
                                                            selectedProduct.specifications,
                                                        ).map(
                                                            ([key, value]: [
                                                                string,
                                                                any,
                                                            ]) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex items-start justify-between gap-6 border-b border-slate-100 py-2 text-sm dark:border-gray-800"
                                                                >
                                                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                                                        {key}
                                                                    </span>
                                                                    <span className="text-right text-slate-600 dark:text-slate-400">
                                                                        {String(
                                                                            value,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            No specifications
                                                            available.
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    {Array.isArray(
                                                        selectedProduct.features,
                                                    ) &&
                                                    selectedProduct.features
                                                        .length ? (
                                                        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
                                                            {selectedProduct.features.map(
                                                                (
                                                                    feature: string,
                                                                    index: number,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {
                                                                            feature
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            No features
                                                            available.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* ✅ CTA */}
                                        <button
                                            onClick={() =>
                                                handleAddToCart(
                                                    selectedProduct.id,
                                                    selectedProduct.stock_status,
                                                )
                                            }
                                            className="mt-6 w-full rounded-2xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 text-center text-slate-600 dark:text-slate-300">
                                    No product selected.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= FEEDBACK TOAST ================= */}
            {feedback && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm shadow-lg ${
                        feedback.type === 'success'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                    }`}
                >
                    {feedback.type === 'success' ? (
                        <CheckCircle size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}
                    <span>{feedback.message}</span>
                </div>
            )}
        </Publiclayout>
    );
}
