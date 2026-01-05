//import { Inertia } from '@inertiajs/react'
import BackendLayout from '@/layouts/backend/backend-layout'

interface DashboardProps {
    totalUsers: number
    totalAdmins: number
    totalProducts: number
    totalOrders: number
}

export default function Dashboard({ totalUsers, totalAdmins, totalProducts, totalOrders }: DashboardProps) {
    return (
        <BackendLayout title="Admin Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
                    <div className="text-4xl font-bold">{totalUsers}</div>
                    <div className="text-gray-500">Users</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
                    <div className="text-4xl font-bold">{totalAdmins}</div>
                    <div className="text-gray-500">Admins</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
                    <div className="text-4xl font-bold">{totalProducts}</div>
                    <div className="text-gray-500">Products</div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
                    <div className="text-4xl font-bold">{totalOrders}</div>
                    <div className="text-gray-500">Orders</div>
                </div>
            </div>
        </BackendLayout>
    )
}
