
import { Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex justify-end items-center bg-white p-4 border-b">
      <button className="relative mr-4">
        <Bell size={20} />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center gap-2">
        <User size={20} />
        <span className="font-medium">Admin</span>
      </div>
    </header>
  );
}
