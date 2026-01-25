"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchSection from "@/features/services/components/SearchSection";
import FilterSidebar from "@/features/services/components/FilterSidebar";
import ResultsSection from "@/features/services/components/ResultsSection";
import Pagination from "@/features/services/components/Pagination";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import { searchService } from "@/shared/services/search.service";
import { serviceService } from "@/shared/services/service.service";
import type { SearchResult, SearchFilters } from "@/shared/types/search";
import type { Service } from "@/shared/services/service.service";
import { toast } from "sonner";

function ServicesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State from URL params
  const query = searchParams.get("q") || "";
  const serviceId = searchParams.get("serviceId") || undefined;
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
  const language = searchParams.get("language") || undefined;
  const sortBy = (searchParams.get("sortBy") as "name" | "rating" | "price" | "date") || "date";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [searchQuery, setSearchQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(page);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    serviceId,
    minPrice,
    maxPrice,
    minRating,
    language,
  });

  // Load services for filter dropdown
  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await serviceService.getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };
    loadServices();
  }, []);

  // Search function
  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchService.searchProviderProfiles({
        q: searchQuery || undefined,
        serviceId: filters.serviceId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        language: filters.language,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 10,
      });
      setSearchResult(result);
    } catch (error: any) {
      console.error("Search failed:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url || "unknown",
      });

      // Handle different error types
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.message || error?.message;

      // For public endpoints, we should handle errors gracefully
      // Only show user-facing errors for specific cases
      if (status === 404) {
        // Endpoint not found - might be a configuration issue
        console.error("Search endpoint not found. Check API configuration.");
        setSearchResult({
          profiles: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      } else if (status && status >= 500) {
        // Server errors
        toast.error("Server error. Please try again later.");
        setSearchResult({
          profiles: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      } else if (status && status >= 400 && status < 500) {
        // Client errors (400-499) - show error message
        toast.error(errorMessage || "Failed to search providers. Please try again.");
        setSearchResult({
          profiles: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      } else {
        // Network error, CORS, or other issues - don't show toast, just log
        console.warn("Search request failed - this might be a network, CORS, or server connectivity issue");
        // Set empty result but don't show error to user
        setSearchResult({
          profiles: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortBy, sortOrder, currentPage]);

  // Update URL params when filters/search change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (filters.serviceId) params.set("serviceId", filters.serviceId);
    if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.minRating !== undefined) params.set("minRating", filters.minRating.toString());
    if (filters.language) params.set("language", filters.language);
    if (sortBy !== "date") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());

    navigate(`/services?${params.toString()}`, { replace: true });
  }, [searchQuery, filters, sortBy, sortOrder, currentPage, navigate]);

  // Perform search when dependencies change
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Handle search input change
  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    performSearch();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onSearch={performSearch}
      />
      <div className="max-w-[90rem] h-px bg-gray-300 mx-auto"></div>

      <div className="max-w-[90rem] mx-auto py-8 mt-[5rem]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">Filters</span>
              <svg
                className={`w-5 h-5 transition-transform ${showMobileFilters ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar - responsive */}
          <div className={`${showMobileFilters ? "block" : "hidden"} lg:block`}>
            <FilterSidebar
              filters={filters}
              setFilters={handleFilterChange}
              services={services}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          <div className="flex-1 mb-[5rem]">
            <ResultsSection
              searchResult={searchResult}
              loading={loading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(newSortBy, newSortOrder) => {
                // Update will be handled by URL params change
                const params = new URLSearchParams(searchParams);
                params.set("sortBy", newSortBy);
                params.set("sortOrder", newSortOrder);
                params.set("page", "1");
                navigate(`/services?${params.toString()}`, { replace: true });
              }}
            />
            {searchResult && searchResult.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={searchResult.totalPages}
                setCurrentPage={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
      <div className="max-w-[90rem] h-px bg-gray-300 mx-auto"></div>

      <Footer />
    </div>
  );
}

export default ServicesPage;
