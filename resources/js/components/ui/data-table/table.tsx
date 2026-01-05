import React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export function Table({ headers, children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <table
        className={cn("w-full border-collapse text-sm text-gray-700 dark:text-gray-300", className)}
        {...props}
      >
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
