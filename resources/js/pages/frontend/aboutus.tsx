import Publiclayout from '@/layouts/publiclayout';

export default function AboutPage() {
    return (
        <Publiclayout>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-cyan-500 to-cyan-700 py-20 text-white text-center dark:from-cyan-700 dark:to-cyan-900">
                <div className="container mx-auto px-6">
                    <h1 className="mb-4 text-4xl font-extrabold md:text-6xl dark:text-white">
                        About UruaOnline
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl dark:text-gray-200">
                        UruaOnline is committed to connecting businesses and individuals 
                        with cutting-edge technology solutions. Our goal is to provide 
                        reliable, innovative, and accessible products that empower our 
                        customers to achieve more.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-900 mb-4 dark:text-cyan-400">Our Mission</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        To deliver high-quality tech solutions that meet the unique needs 
                        of every customer. We strive to simplify technology, making it 
                        accessible and easy to use for everyone.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-cyan-900 mb-4 dark:text-cyan-400">Our Vision</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        To become a leading technology solutions provider, known for 
                        innovation, reliability, and exceptional customer service. 
                        We envision a world where technology seamlessly enhances daily life.
                    </p>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-center text-cyan-900 mb-12 dark:text-cyan-400">
                    Why Choose UruaOnline?
                </h2>
                <div className="grid gap-10 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition dark:bg-gray-800 dark:shadow-gray-700/50">
                        <h3 className="mb-2 text-xl font-semibold dark:text-white">Reliable Products</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            We offer top-quality products that you can trust.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition dark:bg-gray-800 dark:shadow-gray-700/50">
                        <h3 className="mb-2 text-xl font-semibold dark:text-white">Innovative Solutions</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Our solutions are designed to meet modern challenges efficiently.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition dark:bg-gray-800 dark:shadow-gray-700/50">
                        <h3 className="mb-2 text-xl font-semibold dark:text-white">Customer Focused</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            We prioritize our customers’ satisfaction above everything else.
                        </p>
                    </div>
                </div>
            </section>
        </Publiclayout>
    );
}
