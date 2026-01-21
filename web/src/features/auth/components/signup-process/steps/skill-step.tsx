"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "@/shared/services";

interface SkillsStepProps {
  skills: string[];
  serviceId: string;
  onUpdate: (skills: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FetchedSkill {
  id: string;
  skill_name: string;
  skill_description?: string;
}

const skillsByService = {
  ENGINEERING: [
    "Mechanical Design",
    "CAD/CAM",
    "Structural Analysis",
    "Electrical Engineering",
    "Civil Engineering",
    "AutoCAD",
    "SolidWorks",
    "MATLAB",
    "Project Management",
    "Technical Documentation",
  ],
  WRITING: [
    "Research Writing",
    "Literature Review",
    "Data Analysis",
    "Academic Editing",
    "Citation Management",
    "Thesis Writing",
    "Statistical Analysis",
    "Academic Publishing",
    "Proofreading",
    "Content Writing",
  ],
  TUTORING: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science",
    "Programming",
    "Test Preparation",
    "Curriculum Development",
    "Online Teaching",
  ],
};

export default function SkillsStep({
  skills,
  serviceId,
  onUpdate,
  onNext,
  onBack,
}: SkillsStepProps) {
  const [customSkill, setCustomSkill] = useState("");
  const [fetchedSkills, setFetchedSkills] = useState<FetchedSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use fetched skills if available, otherwise fallback to demo data
  const availableSkills =
    fetchedSkills.length > 0
      ? fetchedSkills.map((s) => s.skill_name)
      : skillsByService[serviceId as keyof typeof skillsByService] || [];

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      onUpdate(skills.filter((s) => s !== skill));
    } else {
      onUpdate([...skills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      onUpdate([...skills, customSkill.trim()]);
      setCustomSkill(customSkill.trim());
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate(skills.filter((s) => s !== skill));
  };

  useEffect(() => {
    setIsLoading(true);
    apiClient({
      url: `/services/${serviceId}/skills`,
      options: { method: "GET" },
    })
      .then((res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          setFetchedSkills(res);
        }
      })
      .catch(() => { })
      .finally(() => {
        setIsLoading(false);
      });
  }, [serviceId]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        What are your skills and expertise?
      </h2>
      <p className="text-gray-600 mb-8">
        Select or add skills that best describe your expertise
      </p>

      {skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Selected Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#768de8] text-white rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="cursor-pointer hover:bg-white hover:text-[#768de8] rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {isLoading ? "Loading skills..." : "Suggested Skills"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${skills.includes(skill)
                  ? "bg-[#768de8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add custom skill
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
          />
          <button
            onClick={addCustomSkill}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={skills.length === 0}
          className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next: add your experience
        </button>
      </div>
    </div>
  );
}
