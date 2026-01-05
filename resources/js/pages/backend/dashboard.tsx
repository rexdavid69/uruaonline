import BackendLayout from "@/layouts/backend/backend-layout";
import { Head } from "@inertiajs/react";
interface DashboardProps {
    productCount: number;
    userCount: number; 
  }

  export default function Dashboard({ productCount, userCount }: DashboardProps) {
    return (
      <BackendLayout>
        <Head title="Dashboard" />

        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 p-6 flex flex-col justify-center items-center">
              <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold">Products</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{productCount}</p>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 p-6 flex flex-col justify-center items-center">
              <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold">Orders</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 p-6 flex flex-col justify-center items-center">
              <h2 className="text-gray-700 dark:text-gray-200 text-xl font-semibold">Users</h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userCount}</p>
            </div>
          </div>
        </div>
      </BackendLayout>
    );
  }
