import Publiclayout from '@/layouts/publiclayout';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    return (
        <Publiclayout>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-cyan-500 to-cyan-700 py-20 text-white text-center">
                <div className="container mx-auto px-6">
                    <h1 className="mb-4 text-4xl font-extrabold md:text-6xl">
                        Contact Us
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl dark:text-black">
                        We’d love to hear from you. Whether you have questions,
                        feedback, or need support — our team is here to help.
                    </p>
                </div>
            </section>

            {/* Contact Info + Form */}
            <section className="container mx-auto grid gap-12 px-6 py-16  md:grid-cols-2">
                {/* Contact Information */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold">Get in Touch</h2>
                    <p className="text-gray-600 dark:text-white">
                        Reach out to us via phone, email, or visit our office.
                        We’ll respond as soon as possible.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Phone className="h-6 w-6 text-cyan-600" />
                            <span className="text-gray-800 dark:text-white">+234 801 234 5678</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="h-6 w-6 text-cyan-600" />
                            <span className="text-gray-800 dark:text-white">support@uruaonline.com</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="h-6 w-6 text-cyan-600" />
                            <span className="text-gray-800 dark:text-white">
                                123 Marina Road, Lagos, Nigeria
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Send us a Message</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Message
                            </label>
                            <textarea
                                rows={5}
                                className="w-full rounded-lg border border-gray-300 p-3 focus:border-cyan-600 focus:ring focus:ring-cyan-100"
                                placeholder="Write your message here..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </Publiclayout>
    );
}
