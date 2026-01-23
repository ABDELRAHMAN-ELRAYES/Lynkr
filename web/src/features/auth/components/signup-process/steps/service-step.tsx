"use client";

import { apiClient } from "@/shared/services";
import { ServiceTypes } from "@/shared/types/auth/signup";
import { Briefcase, GraduationCap, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceTypeStepProps {
  serviceId: string;
  onUpdate: (serviceId: string, serviceType: ServiceTypes) => void;
  onNext: () => void;
}

export default function ServiceTypeStep({
  serviceId,
  onUpdate,
  onNext,
}: ServiceTypeStepProps) {
  const [services, setServices] = useState<
    {
      id: string;
      name: string;
      description: string;
      service_type: string; // This might also be just 'name' or derived from it?
      // Looking at the code, service_type is used for icon mapping.
      // The backend doesn't seem to have service_type, just name.
      // We might need to map name to icon logic.
    }[]
  >([]);

  const icons = {
    ENGINEERING: Briefcase,
    WRITING: GraduationCap,
    TUTORING: BookOpen,
  };

  const handleSelect = (id: string, type: ServiceTypes) => {
    onUpdate(id, type);
  };

  useEffect(() => {
    apiClient({
      url: "/services",
      options: { method: "GET" },
    })
      .then((res) => {
        // Handle various response structures
        const servicesData = res?.data?.services || res?.services || res?.data || res || [];
        setServices(Array.isArray(servicesData) ? servicesData : []);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Choose your service type
      </h2>
      <p className="text-gray-600 mb-8">
        Select the primary service you'll be offering on our platform
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {services.map((service) => {
          // Basic mapping logic for icons based on name since we don't have service_type
          let typeKey = "ENGINEERING";
          if (service.name.toUpperCase().includes("WRIT")) typeKey = "WRITING";
          if (service.name.toUpperCase().includes("TUTOR") || service.name.toUpperCase().includes("TEACH")) typeKey = "TUTORING";

          const Icon = icons[typeKey as keyof typeof icons] ?? Briefcase;

          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id, service.name.toUpperCase() as ServiceTypes)}
              className={`p-6 border-2 rounded-lg text-left transition-all hover:border-[#768de8] ${serviceId === service.id
                  ? "border-[#7682e8] bg-[#ccd0f59d]"
                  : "border-gray-200"
                }`}
            >
              <Icon
                className={`w-8 h-8 mb-4 ${serviceId === service.id ? "text-[#7682e8]" : "text-gray-400"
                  }`}
              />
              <h3 className="font-semibold text-lg mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600">
                {service.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!serviceId}
          className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#667ce0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next: add your skills
        </button>
      </div>
    </div>
  );
}
