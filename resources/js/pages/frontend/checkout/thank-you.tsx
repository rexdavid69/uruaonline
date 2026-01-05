import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import UserLayout from "@/layouts/frontend/user-layout";

export default function ThankYou() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    🎉 Thank You for Your Order!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Your order has been received successfully. We’ll contact you
                    shortly with delivery details.
                </p>

                <Button asChild>
                    <Link href="/catalog">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}

ThankYou.layout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>;
