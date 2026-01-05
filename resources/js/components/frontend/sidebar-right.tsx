import React, { useState } from "react";
import { Menu } from "lucide-react";

const SidebarRight = () => {
  const [open, setOpen] = useState(false);

  const featured = [
    { id: 1, name: "Marine Radars", image: "/images/furuno radar.png" },
    { id: 2, name: "AIS Transponders", image: "/images/ais-icom.png" },
    { id: 3, name: "VHF/UHF Radios", image: "/images/uhf radio.png" },
    { id: 4, name: "Iridium Satellite Phones", image: "/images/iriduim pilot.png" },
    { id: 5, name: "Furuno Equipment", image: "/images/furuno bfa-170.png" },
    { id: 6, name: "Inmarsat Terminals", image: "/images/inmarsat fleet one.png" },
    { id: 7, name: "Thuraya Devices", image: "/images/thuraya atlas.png" },
  ];

  const renderItems = () => (
    <div className="space-y-4">
      {featured.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-md transition"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {item.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-cyan-500 border-b border-gray-300 dark:border-gray-700 pb-2">
          Featured Products
        </h3>
        {renderItems()}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden mt-6">
        <button
          className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-semibold"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-5 h-5" /> Featured Products
        </button>

        {open && (
          <div className="mt-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow">
            {renderItems()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarRight;
