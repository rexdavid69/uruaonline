import React, { useState } from "react";
import { Info, HelpCircle, Phone, Menu } from "lucide-react";

const SidebarLeft = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "About Us", icon: Info },
    { name: "Help Center", icon: HelpCircle },
    { name: "Contact Support", icon: Phone },
  ];

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block ">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-cyan-500 border-b border-gray-300 dark:border-gray-700 pb-2">
          Quick Links
        </h3>
        <ul className="space-y-3">
          {links.map((link, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
            >
              <link.icon className="w-5 h-5 text-cyan-600" />
              <span className="text-gray-700 dark:text-gray-300">
                {link.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-semibold"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-5 h-5" /> Quick Links
        </button>

        {open && (
          <div className="mt-3 space-y-3 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            {links.map((link, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
              >
                <link.icon className="w-5 h-5 text-cyan-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  {link.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
