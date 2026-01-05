import Footer from '@/components/frontend/footer';
import Navbar from '@/components/frontend/navbar';
import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <Navbar />

            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AuthLayout;
