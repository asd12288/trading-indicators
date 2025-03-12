import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range if current page is near start or end
    if (currentPage <= 3) {
      rangeEnd = Math.min(totalPages - 1, maxVisiblePages - 1);
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("ellipsis1");
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("ellipsis2");
    }

    // Always show last page (if not already included)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, index) => {
        // Use a proper unique key that combines the page value and its position
        const key =
          typeof page === "number" ? `page-${page}` : `${page}-${index}`;

        return page === "ellipsis1" || page === "ellipsis2" ? (
          <span key={key} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <Button
            key={key}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(Number(page))}
            className={
              currentPage === page
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
