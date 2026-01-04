"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

const Pagination = ({ currentPage, setCurrentPage }: PaginationProps) => {
  const totalPages = 10

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getVisiblePages = () => {
    const pages = []
    const showPages = 5 // Number of pages to show

    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    const end = Math.min(totalPages, start + showPages - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 flex-wrap">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </button>

      {/* Show first page if not in visible range */}
      {getVisiblePages()[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            1
          </button>
          {getVisiblePages()[0] > 2 && <span className="px-1 sm:px-2 text-gray-500 text-sm sm:text-base">...</span>}
        </>
      )}

      {/* Visible page numbers */}
      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            currentPage === page ? "bg-[#7682e8] text-white" : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Show last page if not in visible range */}
      {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
        <>
          {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && (
            <span className="px-1 sm:px-2 text-gray-500 text-sm sm:text-base">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </button>
    </div>
  )
}

export default Pagination
