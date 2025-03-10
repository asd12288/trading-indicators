"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Generate an array of page numbers to display
  const getPageNumbers = (): (number | null)[] => {
    const pages: (number | null)[] = [];

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage > 3) pages.push(null);

    // Current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) pages.push(null);

    // Always show last page if more than one page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === null ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
              ...
            </span>
          ) : (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "default" : "outline"}
              size="sm"
              className="h-8 w-8"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ),
        )}

        <Button
          
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
