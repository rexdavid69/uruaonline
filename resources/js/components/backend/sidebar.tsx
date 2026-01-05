import { Link } from '@inertiajs/react';
import { Home, Package, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Urua Admin</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/backend">
          <div className="flex items-center gap-2 hover:text-blue-600">
            <Home size={20} /> Dashboard
          </div>
        </Link>
        <Link href="/backend/products">
          <div className="flex items-center gap-2 hover:text-blue-600">
            <Package size={20} /> Products
          </div>
        </Link>
        <Link href="/backend/orders">
          <div className="flex items-center gap-2 hover:text-blue-600">
            <Package size={20} /> Orders
          </div>
        </Link>
        <Link href="/backend/users">
          <div className="flex items-center gap-2 hover:text-blue-600">
            <Users size={20} /> Users
          </div>
        </Link>
        <Link href="/backend/settings">
          <div className="flex items-center gap-2 hover:text-blue-600">
            <Settings size={20} /> Settings
          </div>
        </Link>
      </nav>
    </aside>
  );
}
