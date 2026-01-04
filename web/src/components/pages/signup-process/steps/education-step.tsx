"use client";

import { Plus } from "lucide-react";
import type { Education } from "@/types/signup-process-types";
import EducationModal from "@/components/pages/signup-process/modals/educational-modal";
import { useState } from "react";

interface EducationStepProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EducationStep({
  education,
  onUpdate,
  onNext,
  onBack,
}: EducationStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  const handleSave = (edu: Education) => {
    if (editingEducation) {
      onUpdate(education.map((e) => (e.id === edu.id ? edu : e)));
    } else {
      onUpdate([...education, edu]);
    }
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    onUpdate(education.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Clients like to know what you know - add your education here.
      </h2>
      <p className="text-gray-600 mb-8">
        You don't have to have a degree. Adding any relevant education helps
        make your profile more visible.
      </p>

      <div className="space-y-4 mb-8">
        {education.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{edu.school}</h3>
                <p className="text-gray-600">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                <p className="text-sm text-gray-500">
                  {edu.fromYear} - {edu.toYear}
                </p>
                {edu.description && (
                  <p className="mt-2 text-gray-700">{edu.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="cursor-pointer text-[#768de8] hover:text-[#768de8]-dark text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="cursor-poionter text-red-600 hover:text-red-700 text-sm font-medium"
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
            <span className="font-medium">Add education</span>
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
            Next: add languages
          </button>
        </div>
      </div>

      {isModalOpen && (
        <EducationModal
          education={editingEducation}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEducation(null);
          }}
        />
      )}
    </div>
  );
}
