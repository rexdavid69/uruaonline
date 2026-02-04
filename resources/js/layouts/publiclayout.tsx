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
            <div className="flex-1">{children}</div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
