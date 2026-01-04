"use client";

import { Plus } from "lucide-react";
import type { Experience } from "@/types/signup-process-types";
import ExperienceModal from "@/components/pages/signup-process/modals/experience-modal";
import { useState } from "react";

interface ExperienceStepProps {
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceStep({
  experience,
  onUpdate,
  onNext,
  onBack,
}: ExperienceStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const handleSave = (exp: Experience) => {
    if (editingExperience) {
      onUpdate(experience.map((e) => (e.id === exp.id ? exp : e)));
    } else {
      onUpdate([...experience, exp]);
    }
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(experience.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        If you have relevant work experience, add it here.
      </h2>
      <p className="text-gray-600 mb-8">
        Freelancers who add their experience are twice as likely to win work.
        But if you're just starting out, you can still create a great profile.
        Just head on to the next page.
      </p>

      <div className="space-y-4 mb-8">
        {experience.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.startMonth} {exp.startYear} -{" "}
                  {exp.currentlyWorking
                    ? "Present"
                    : `${exp.endMonth} ${exp.endYear}`}
                </p>
                <p className="text-sm text-gray-500">
                  {exp.location}, {exp.country}
                </p>
                {exp.description && (
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="cursor-pointer text-[#768de8] hover:text-[#768de8]-dark text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="cursor-pointer text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#768de8] hover:bg-gray-50 transition-colors"
        >
          <div className="cursor-pointer flex flex-col items-center justify-center text-gray-600">
            <div className="w-10 h-10 rounded-full bg-[#768de8] text-white flex items-center justify-center mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">Add experience</span>
          </div>
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onNext}
            className="cursor-pointer px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={onNext}
            className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#768de8]-dark"
          >
            Next: add your education
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ExperienceModal
          experience={editingExperience}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExperience(null);
          }}
        />
      )}
    </div>
  );
}
