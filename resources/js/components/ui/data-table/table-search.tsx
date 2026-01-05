import React from "react";
import { FaSearch } from "react-icons/fa";

interface TableSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TableSearch({ placeholder = "Search...", value, onChange }: TableSearchProps) {
  return (
    <div className="relative w-full sm:w-64">
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
      />
    </div>
  );
}
