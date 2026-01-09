"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import type { Experience } from "@/shared/types/signup-process-types";

interface ExperienceModalProps {
  experience: Experience | null;
  onSave: (experience: Experience) => void;
  onClose: () => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 50 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

export default function ExperienceModal({
  experience,
  onSave,
  onClose,
}: ExperienceModalProps) {
  const [formData, setFormData] = useState<Experience>({
    id: experience?.id || Date.now().toString(),
    title: experience?.title || "",
    company: experience?.company || "",
    location: experience?.location || "",
    country: experience?.country || "",
    startMonth: experience?.startMonth || "",
    startYear: experience?.startYear || "",
    endMonth: experience?.endMonth || "",
    endYear: experience?.endYear || "",
    currentlyWorking: experience?.currentlyWorking || false,
    description: experience?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#0000007d] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Work Experience</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Ex: Microsoft"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Ex: London"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={(e) =>
                setFormData({ ...formData, currentlyWorking: e.target.checked })
              }
              className="cursor-pointer w-4 h-4 text-[#768de8] border-gray-300 rounded focus:ring-[#768de8]"
            />
            <label htmlFor="currentlyWorking" className="text-sm text-gray-700">
              I am currently working in this role
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                required
                value={formData.startMonth}
                onChange={(e) =>
                  setFormData({ ...formData, startMonth: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                required
                value={formData.startYear}
                onChange={(e) =>
                  setFormData({ ...formData, startYear: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!formData.currentlyWorking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  required={!formData.currentlyWorking}
                  value={formData.endMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, endMonth: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  required={!formData.currentlyWorking}
                  value={formData.endYear}
                  onChange={(e) =>
                    setFormData({ ...formData, endYear: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-6 py-2 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#768de8]-dark"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
