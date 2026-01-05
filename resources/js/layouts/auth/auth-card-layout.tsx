import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4
                        bg-gradient-to-tr from-[#00c6ff] via-[#0072ff] to-[#005bea]">
            <div className="w-full max-w-md flex flex-col gap-6">
                {/* Logo */}
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full
                                    transition-transform duration-300 hover:scale-110 bg-white shadow-md">
                        <AppLogoIcon className="size-9 fill-current text-[#0072ff]" />
                    </div>
                </Link>

                {/* Card */}
                <Card className="rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <CardHeader className="px-10 pt-8 pb-0 text-center">
                        <CardTitle className="text-2xl font-semibold text-gray-800">{title}</CardTitle>
                        <CardDescription className="text-gray-500">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
