import Footer from '@/components/frontend/footer';
import Navbar from '@/components/frontend/navbar';
//import SidebarLeft from '@/components/frontend/sidebar-left';
//import SidebarRight from '@/components/frontend/sidebar-right';
import React from 'react';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1 gap-10 px-6 py-10">
                {/* Main Content */}
                <main className="flex-1 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
