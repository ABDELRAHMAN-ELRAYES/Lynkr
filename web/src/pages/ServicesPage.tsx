"use client";

import { useState } from "react";
import SearchSection from "@/components/pages/services-page/SearchSection";
import FilterSidebar from "@/components/pages/services-page/FilterSidebar";
import ResultsSection from "@/components/pages/services-page/ResultsSection";
import Pagination from "@/components/pages/services-page/Pagination";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    hourlyRate: "",
    experienceLevel: [],
    location: "",
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
                className={`w-5 h-5 transition-transform ${
                  showMobileFilters ? "rotate-180" : ""
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
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          <div className="flex-1 mb-[5rem]">
            <ResultsSection />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          
        </div>
      </div>
      <div className="max-w-[90rem] h-px bg-gray-300 mx-auto"></div>

      <Footer/>
    </div>
  );
}

export default ServicesPage;
