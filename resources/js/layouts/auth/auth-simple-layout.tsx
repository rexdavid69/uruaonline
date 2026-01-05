import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 
                        bg-gradient-to-tr from-[#00c6ff] via-[#0072ff] to-[#005bea]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                <div className="flex flex-col gap-8">
                    {/* Logo and Header */}
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-20 w-auto items-center justify-center rounded-md 
                                            transition-transform duration-300 hover:scale-105">
                                <AppLogoIcon className="size-20 fill-current text-gray-800 dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                    </div>

                    {/* Children (Form) */}
                    {children}
                </div>
            </div>
        </div>
    );
}
