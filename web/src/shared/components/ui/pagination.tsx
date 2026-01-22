import React from 'react';
import Button from './Button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
}) => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePrevious = () => {
        if (!isFirstPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis-start');
            }

            // Show current page and neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis-end');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (typeof page === 'string') {
                return (
                    <div key={page} className="flex h-9 w-9 items-center justify-center">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>
                );
            }

            return (
                <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={cn(
                        "h-9 w-9 p-0",
                        currentPage === page ? "pointer-events-none" : "hover:bg-gray-100"
                    )}
                >
                    {page}
                </Button>
            );
        });
    };

    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-center space-x-2", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={isFirstPage}
                className="h-9 w-9 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
            </Button>

            <div className="flex items-center space-x-2">
                {renderPageNumbers()}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={isLastPage}
                className="h-9 w-9 p-0"
            >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
            </Button>
        </div>
    );
};
