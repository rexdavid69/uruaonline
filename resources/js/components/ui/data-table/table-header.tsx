import React from "react";
//import { cn } from "@/lib/utils";

interface TableHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function TableSectionHeader({ title, description, action }: TableHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}
