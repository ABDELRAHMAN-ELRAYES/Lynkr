"use client";

import { FC, useState } from "react";
import { Star, User, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OperationRequestForm from "@/shared/components/common/modals/request-modal";
import ProviderProfileModal from "@/features/services/components/ProviderProfileModal";
import type { SearchResult } from "@/shared/types/search";
import type { SortBy, SortOrder } from "@/shared/types/search";

interface ResultsSectionProps {
  searchResult: SearchResult | null;
  loading: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange?: (sortBy: SortBy, sortOrder: SortOrder) => void;
}

const ResultsSection: FC<ResultsSectionProps> = ({
  searchResult,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const handleViewProfile = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsProfileModalOpen(true);
  };

  const handleViewProfilePage = (providerId: string) => {
    navigate(`/providers/${providerId}`);
  };

  const handleRequest = (providerId: string) => {
    setSelectedProviderId(providerId);
    setIsRequestModalOpen(true);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProviderId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Start searching to find providers</p>
      </div>
    );
  }

  if (searchResult.profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-2">No providers found</p>
        <p className="text-gray-500 text-sm">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Request Modal */}
      {isRequestModalOpen && selectedProviderId && (
        <div className="fixed inset-0 bg-[#0000007d] z-[1005] flex items-center justify-center">
          {(() => {
            const provider = searchResult.profiles.find(p => p.id === selectedProviderId);
            if (!provider) return null;
            const providerName = provider.user
              ? `${provider.user.firstName} ${provider.user.lastName}`
              : "Provider";
            return (
              <OperationRequestForm
                close={handleCloseRequestModal}
                isOpen={isRequestModalOpen}
                providerId={selectedProviderId}
                providerName={providerName}
                providerTitle={provider.title}
                providerServiceId={provider.serviceId}
              />
            );
          })()}
        </div>
      )}

      {/* Profile Modal */}
      {selectedProviderId && (
        <ProviderProfileModal
          providerId={selectedProviderId}
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
        />
      )}

      <div>
        {/* Header with results count and sort */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-900">
            <span className="font-bold">{searchResult.total}</span>{" "}
            {searchResult.total === 1 ? "result" : "results"} found
          </h3>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-") as [
                  SortBy,
                  SortOrder
                ];
                if (onSortChange) {
                  onSortChange(newSortBy, newSortOrder);
                }
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent"
              aria-label="Sort results"
            >
              <option value="date-desc">Latest</option>
              <option value="date-asc">Oldest</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {searchResult.profiles.map((provider) => {
            const fullName = provider.user
              ? `${provider.user.firstName} ${provider.user.lastName}`
              : "Provider";
            const displayName = provider.user
              ? `${provider.user.firstName} ${provider.user.lastName.charAt(0)}.`
              : "Provider";
            const rating = typeof provider.averageRating === 'number'
              ? provider.averageRating
              : parseFloat(String(provider.averageRating || 0)) || 0;
            const hourlyRate = typeof provider.hourlyRate === 'number'
              ? provider.hourlyRate
              : parseFloat(String(provider.hourlyRate || 0)) || 0;
            const skills = provider.skills?.map((s) => s.skillName) || [];
            const serviceName = provider.service?.name || "Service Provider";

            return (
              <div
                key={provider.id}
                className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-300 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                    {provider.user?.avatarUrl ? (
                      <img
                        src={provider.user.avatarUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 text-left">
                      <div className="mb-2 sm:mb-0">
                        <h4
                          className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-[#7682e8] transition-colors"
                          onClick={() => handleViewProfilePage(provider.id)}
                        >
                          {displayName}
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {provider.title || serviceName}
                          {provider.service && ` | ${provider.service.name}`}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${hourlyRate.toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">
                            /hr
                          </span>
                        </div>
                      </div>
                    </div>

                    {provider.bio && (
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base line-clamp-2">
                        {provider.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 justify-start">
                        {skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                        {rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        {provider.user?.country && (
                          <div>{provider.user.country}</div>
                        )}
                      </div>

                      <div className="flex gap-3 justify-start sm:justify-end">
                        <button
                          onClick={() => handleViewProfile(provider.id)}
                          className="cursor-pointer p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          aria-label={`View ${fullName}'s profile`}
                        >
                          <User className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleRequest(provider.id)}
                          className="cursor-pointer px-6 py-2 bg-[#7682e8] text-white rounded-lg transition-colors font-medium hover:bg-[#5a67d8]"
                        >
                          Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ResultsSection;
