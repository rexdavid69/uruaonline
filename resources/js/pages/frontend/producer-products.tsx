/* eslint-disable @typescript-eslint/no-explicit-any */
import LazyImage from '@/components/lazy-images';
import Publiclayout from '@/layouts/publiclayout';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    price: number;
    image?: string;
    stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
    sku?: string;
    mpn?: string;
}

export default function ProducerProducts() {
    const { props } = usePage<any>();
    const producerId = props.producerId;

    const [producer, setProducer] = useState<Producer | null>(null);
    const [groupedCategories, setGroupedCategories] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingProductData, setLoadingProductData] = useState(false);
    const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');

    const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

    const getImageUrl = (path?: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `${APP_URL}/storage/${path.replace(/^storage\/|^public\//, '')}`;
    };

    // Fetch producer + products
    useEffect(() => {
        const fetchData = async () => {
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

    // Add to cart
    const handleAddToCart = async (productId: number, stock_status: string) => {
        if (stock_status === 'out_of_stock') return;
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

    // View specifications & features
    const handleViewProductData = async (productId: number) => {
        setLoadingProductData(true);
        setModalOpen(true);
        setActiveTab('specs');
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

    if (loading) {
        return (
            <Publiclayout>
                <div className="py-20 text-center text-gray-500 dark:text-gray-300">
                    Loading products...
                </div>
            </Publiclayout>
        );
    }

    return (
        <Publiclayout>
            {/* Producer Info */}
            {producer && (
                <section className="container mx-auto flex flex-col gap-6 px-6">
                    <h1 className="text-left text-3xl font-bold text-cyan-800 uppercase dark:text-cyan-300">
                        {producer.name}
                    </h1>
                    {producer.logo && getImageUrl(producer.logo) && (
                        <LazyImage
                            src={getImageUrl(producer.logo)!}
                            alt={producer.name}
                            className="mx-auto h-40 object-contain"
                        />
                    )}
                    <p className="text-center font-semibold text-gray-700 dark:text-gray-300">
                        {producer.description}
                    </p>
                </section>
            )}

            {/* Grouped Categories */}
            <section className="container mx-auto mt-8 space-y-10 px-6">
                {Object.keys(groupedCategories).length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-300">
                        No products found for this producer.
                    </p>
                ) : (
                    Object.entries(groupedCategories).map(
                        ([categoryName, subcats]: [string, any], i) => (
                            <div key={i}>
                                <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-cyan-800 dark:text-cyan-300">
                                    {categoryName}
                                </h2>
                                {Object.entries(
                                    subcats as Record<string, Product[]>,
                                ).map(([subName, products]) => (
                                    <div key={subName} className="mb-8">
                                        <h3 className="mb-3 text-xl font-semibold text-cyan-700 dark:text-cyan-400">
                                            {subName}
                                        </h3>
                                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                            {Array.isArray(products) &&
                                                products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="relative flex flex-col overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg dark:bg-cyan-950"
                                                    >
                                                        {product.image &&
                                                            getImageUrl(
                                                                product.image,
                                                            ) && (
                                                                <LazyImage
                                                                    src={
                                                                        getImageUrl(
                                                                            product.image,
                                                                        )!
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-48 w-full object-contain"
                                                                />
                                                            )}
                                                        <div className="flex flex-1 flex-col p-4">
                                                            <h3 className="text-lg font-semibold text-cyan-800 dark:text-cyan-300">
                                                                {product.name}
                                                            </h3>
                                                            <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                                                                {
                                                                    product.description
                                                                }
                                                            </p>
                                                            <p className="mt-2 font-bold text-cyan-700 dark:text-cyan-400">
                                                                ₦
                                                                {product.price.toLocaleString()}
                                                            </p>
                                                            <div className="mt-3 flex gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleViewProductData(
                                                                            product.id,
                                                                        )
                                                                    }
                                                                    className="flex-1 rounded-lg border border-cyan-600 py-2 text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300"
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleAddToCart(
                                                                            product.id,
                                                                            product.stock_status,
                                                                        )
                                                                    }
                                                                    className="flex-1 rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ),
                    )
                )}
            </section>

{/* Modal */}
{modalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    onClick={() => setModalOpen(false)} // closes modal on outside click
  >
    <div
      className="relative w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-cyan-950"
      onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside modal
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-800 dark:text-cyan-300">
          {selectedProduct?.name || 'Loading...'}
        </h2>
        <button onClick={() => setModalOpen(false)} className="text-xl font-bold">
          ✕
        </button>
      </div>

      {loadingProductData ? (
        <p>Loading product data...</p>
      ) : selectedProduct?.error ? (
        <p className="text-red-500">{selectedProduct.error}</p>
      ) : (
        <>
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 rounded-lg py-2 font-semibold ${
                activeTab === 'specs'
                  ? 'bg-cyan-600 text-white'
                  : 'border border-cyan-600 text-cyan-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 rounded-lg py-2 font-semibold ${
                activeTab === 'features'
                  ? 'bg-cyan-600 text-white'
                  : 'border border-cyan-600 text-cyan-700'
              }`}
            >
              Features
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl w-full cursor-zoom-in">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right: Specs/Features */}
            <div className="flex flex-col gap-4">
              {selectedProduct?.description && (
                <p className="text-gray-700 dark:text-gray-200">
                  {selectedProduct.description}
                </p>
              )}

              <div className="rounded-lg bg-gray-50 p-3 dark:bg-cyan-900/40">
                {activeTab === 'specs' &&
                  selectedProduct.specifications &&
                  Object.entries(selectedProduct.specifications).map(([key, value]) => (
                    <p
                      key={key}
                      className="flex justify-between text-sm text-gray-700 dark:text-gray-200"
                    >
                      <span className="font-semibold">{key}</span>
                      <span>{String(value)}</span>
                    </p>
                  ))}
                {activeTab === 'features' && selectedProduct.features && (
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
                    {selectedProduct.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                handleAddToCart(selectedProduct.id, selectedProduct.stock_status)
              }
              className="rounded-lg bg-cyan-600 py-3 px-6 text-white font-semibold shadow-lg hover:bg-cyan-700"
            >
              Add to Cart
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}




            {/* Feedback */}
            {feedback && (
                <div
                    className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm shadow-lg ${feedback.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                >
                    {feedback.type === 'success' ? (
                        <CheckCircle size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}{' '}
                    {feedback.message}
                </div>
            )}
        </Publiclayout>
    );
}
