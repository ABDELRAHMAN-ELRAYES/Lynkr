"use client";

import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  return (
    <section className="min-h-[40rem] flex items-center bg-white py-8 sm:py-12 mt-[6rem]">
      <div className="max-w-[90rem] mx-auto text-center">
        <h2 className="max-w-[90rem] px-4 mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent text-[4rem]">
          Find the perfect talent for your project
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
          Search through millions of skilled professionals
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-[90rem] mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for any service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent text-base"
            />
          </div>
          <button className="cursor-pointer w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#7682e8] text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium">
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
