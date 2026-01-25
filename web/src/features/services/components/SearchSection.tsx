"use client";

import { FC, FormEvent } from "react";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
}

const SearchSection: FC<SearchSectionProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <section className="min-h-[40rem] flex items-center bg-white py-8 sm:py-12 mt-[6rem]">
      <div className="max-w-[90rem] mx-auto text-center">
        <h2 className="max-w-[90rem] px-4 mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent text-[4rem]">
          Find the perfect talent for your project
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
          Search through millions of skilled professionals
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-[90rem] mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for any service or provider name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent text-base"
              aria-label="Search providers"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#7682e8] text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium hover:bg-[#5a67d8]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
