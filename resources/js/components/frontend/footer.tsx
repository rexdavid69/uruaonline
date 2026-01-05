import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Twitter} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-cyan-900 text-white">
            <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
                {/* Logo */}
                <div className="flex flex-col items-start">
                    <Link href="/">
                        <img
                            src="/uruaonline_logo_full.png"
                            alt="UruaOnline"
                            className="h-20 w-40 object-contain"
                        />
                    </Link>
                    <p className="mt-4 text-gray-300 text-sm">
                        Connecting you with reliable technology solutions.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="mb-4 font-semibold text-lg">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/catalog" className="hover:text-cyan-400 transition">
                                Catalog
                            </Link>
                        </li>
                        <li>
                            <Link href="/contactus" className="hover:text-cyan-400 transition">
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/aboutus" className="hover:text-cyan-400 transition">
                                About Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="mb-4 font-semibold text-lg">Subscribe</h3>
                    <form className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-full px-4 py-2 text-gray-900 focus:outline-none"
                        />
                        <button className="rounded-full bg-cyan-500 px-6 py-2 hover:bg-cyan-400 transition">
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="mb-4 font-semibold text-lg">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-cyan-400 transition">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-cyan-400 transition">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-cyan-400 transition">
                            <Instagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 py-4 text-center text-gray-300 text-sm">
                © 2025 UruaOnline. All Rights Reserved.
            </div>
        </footer>
    );
}
