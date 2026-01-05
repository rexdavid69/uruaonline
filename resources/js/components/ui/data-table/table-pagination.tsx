import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between border-t p-4 text-sm text-gray-600 dark:text-gray-400">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 disabled:opacity-50"
      >
        <FaChevronLeft className="h-4 w-4" /> Prev
      </button>

      <span>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 disabled:opacity-50"
      >
        Next <FaChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
