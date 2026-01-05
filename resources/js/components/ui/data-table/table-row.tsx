import React from "react";
import { cn } from "@/lib/utils";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
}

export function TableRow({ children, hoverable = true, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-t border-gray-200 dark:border-gray-800",
        hoverable && "hover:bg-gray-50 dark:hover:bg-gray-800/60",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}
