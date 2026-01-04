import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  BookOpen,
  Users,
  Wrench,
  Star,
} from "lucide-react";

interface FilterSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  onApplyFilters?: () => void;
}

const FilterSidebar = ({
  filters,
  setFilters,
  onApplyFilters,
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    serviceField: true,
    priceRange: true,
    rating: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  };

  const serviceFields = [
    {
      id: "research",
      name: "Research Field",
      icon: BookOpen,
    },
    {
      id: "teaching",
      name: "Teaching Field",
      icon: Users,
    },
    {
      id: "engineering",
      name: "Engineering Projects",
      icon: Wrench,
    },
  ];

  const experienceLevels = [];

  const priceRanges = [
    { id: "budget", label: "$5 - $15/hr", range: [5, 15] },
    { id: "standard", label: "$15 - $35/hr", range: [15, 35] },
    { id: "premium", label: "$35 - $60/hr", range: [35, 60] },
    { id: "enterprise", label: "$60+/hr", range: [60, 1000] },
    { id: "custom", label: "Custom Range", range: null },
  ];

  const availabilityOptions = [];

  const popularSkills = [];

  const handleFilterChange = (
    category: string,
    value: any,
    isMultiple = false
  ) => {
    if (isMultiple) {
      const currentValues = filters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      setFilters({ ...filters, [category]: newValues });
    } else {
      setFilters({ ...filters, [category]: value });
    }
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).reduce((count, key) => {
      const value = filters[key];
      if (Array.isArray(value)) {
        return count + value.length;
      } else if (value) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const FilterSection = ({
    title,
    isExpanded,
    onToggle,
    children,
    icon: Icon,
  }: any) => (
    <div className="mb-6">
      <button
        onClick={() => onToggle(title.toLowerCase().replace(" ", ""))}
        className="flex items-center justify-between w-full text-left mb-4 hover:text-blue-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        {/* {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )} */}
      </button>
      {isExpanded && children}
    </div>
  );

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg p-6 h-fit shadow-sm border border-gray-200 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear all ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Service Field - Main Categories */}
      <FilterSection
        title="Service Field"
        isExpanded={expandedSections.serviceField}
        onToggle={toggleSection}
      >
        <div className="space-y-3">
          {serviceFields.map((field) => (
            <label
              key={field.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(filters.serviceFields || []).includes(field.id)}
                onChange={() =>
                  handleFilterChange("serviceFields", field.id, true)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <field.icon className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{field.name}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.priceRange}
        onToggle={toggleSection}
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
                checked={filters.priceRange === range.id}
                onChange={() => handleFilterChange("priceRange", range.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
        {/* Custom Range Inputs - Show only when Custom Range is selected */}
        {filters.priceRange === "custom" && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Set Your Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.customMinPrice || ""}
                onChange={(e) =>
                  handleFilterChange("customMinPrice", e.target.value)
                }
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.customMaxPrice || ""}
                onChange={(e) =>
                  handleFilterChange("customMaxPrice", e.target.value)
                }
                className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        onToggle={toggleSection}
        icon={Star}
      >
        <div className="space-y-3">
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
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < rating
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

      {/* Apply Filters Button */}
      <button
        onClick={onApplyFilters}
        className="w-full bg-[#7682e8] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      >
        Apply Filters ({getActiveFiltersCount()})
      </button>
    </div>
  );
};

export default FilterSidebar;
