"use client";

import { FC, useState } from "react";
import {
  DollarSign,
  Star,
  Globe,
} from "lucide-react";
import type { SearchFilters } from "@/shared/types/search";
import type { Service } from "@/shared/services/service.service";

interface FilterSidebarProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  services: Service[];
  onApplyFilters?: () => void;
}

const FilterSidebar: FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  onApplyFilters,
  services,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    serviceField: true,
    priceRange: true,
    rating: true,
    language: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  };

  const priceRanges = [
    { id: "budget", label: "$5 - $15/hr", min: 5, max: 15 },
    { id: "standard", label: "$15 - $35/hr", min: 15, max: 35 },
    { id: "premium", label: "$35 - $60/hr", min: 35, max: 60 },
    { id: "enterprise", label: "$60+/hr", min: 60, max: undefined },
    { id: "custom", label: "Custom Range", min: undefined, max: undefined },
  ];

  const handleFilterChange = (
    category: keyof SearchFilters,
    value: string | number | undefined
  ) => {
    setFilters({ ...filters, [category]: value });
  };

  const handlePriceRangeChange = (range: typeof priceRanges[0]) => {
    if (range.id === "custom") {
      // Keep existing custom values or set to undefined
      setFilters({
        ...filters,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
    } else {
      setFilters({
        ...filters,
        minPrice: range.min,
        maxPrice: range.max,
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.serviceId) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    if (filters.language) count++;
    return count;
  };

  const FilterSection: FC<{
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    icon?: typeof DollarSign;
  }> = ({ title, isExpanded, onToggle, children, icon: Icon }) => (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left mb-4 hover:text-[#7682e8] transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
      {isExpanded && children}
    </div>
  );

  const selectedPriceRange = priceRanges.find(
    (range) =>
      filters.minPrice === range.min &&
      (range.max === undefined ? filters.maxPrice === undefined : filters.maxPrice === range.max)
  )?.id || (filters.minPrice !== undefined || filters.maxPrice !== undefined ? "custom" : undefined);

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg p-6 h-fit shadow-sm border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#7682e8] underline"
            aria-label="Clear all filters"
          >
            Clear all ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Service Field - Main Categories */}
      <FilterSection
        title="Service Field"
        isExpanded={expandedSections.serviceField}
        onToggle={() => toggleSection("serviceField")}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="service"
              checked={!filters.serviceId}
              onChange={() => handleFilterChange("serviceId", undefined)}
              className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">All Services</span>
          </label>
          {services.map((service) => (
            <label
              key={service.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="service"
                checked={filters.serviceId === service.id}
                onChange={() => handleFilterChange("serviceId", service.id)}
                className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">{service.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.priceRange}
        onToggle={() => toggleSection("priceRange")}
        icon={DollarSign}
      >
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.id}
                onChange={() => handlePriceRangeChange(range)}
                className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
        {/* Custom Range Inputs - Show only when Custom Range is selected */}
        {selectedPriceRange === "custom" && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Set Your Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <span className="text-xs text-gray-500">/hr</span>
            </div>
          </div>
        )}
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection
        title="Minimum Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection("rating")}
        icon={Star}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === undefined}
              onChange={() => handleFilterChange("minRating", undefined)}
              className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Any Rating</span>
          </label>
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleFilterChange("minRating", rating)}
                className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="text-sm text-gray-700 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Language Filter */}
      <FilterSection
        title="Language"
        isExpanded={expandedSections.language}
        onToggle={() => toggleSection("language")}
        icon={Globe}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="language"
              checked={!filters.language}
              onChange={() => handleFilterChange("language", undefined)}
              className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Any Language</span>
          </label>
          {["English", "Arabic", "French", "Spanish", "German"].map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="language"
                checked={filters.language === lang}
                onChange={() => handleFilterChange("language", lang)}
                className="w-4 h-4 text-[#7682e8] border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{lang}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button */}
      {onApplyFilters && (
        <button
          onClick={onApplyFilters}
          className="w-full bg-[#7682e8] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          aria-label={`Apply ${getActiveFiltersCount()} filters`}
        >
          Apply Filters ({getActiveFiltersCount()})
        </button>
      )}
    </div>
  );
};

export default FilterSidebar;
