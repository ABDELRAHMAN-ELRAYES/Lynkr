"use client";

import { Plus } from "lucide-react";
import type { Language } from "@/shared/types/signup-process-types";
import { useState } from "react";
import { commonLanguages, proficiencyLevels } from "@/shared/constants/common-languages";

interface LanguagesStepProps {
  languages: Language[];
  onUpdate: (languages: Language[]) => void;
  onNext: () => void;
  onBack: () => void;
}


export default function LanguagesStep({
  languages,
  onUpdate,
  onNext,
  onBack,
}: LanguagesStepProps) {
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [newProficiency, setNewProficiency] =
    useState<Language["proficiency"]>("CONVERSATIONAL");

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !languages.find((l) => l.name === newLanguage.trim())
    ) {
      onUpdate([
        ...languages,
        {
          id: Date.now().toString(),
          name: newLanguage.trim(),
          proficiency: newProficiency,
        },
      ]);
      setNewLanguage("");
      setShowAddLanguage(false);
    }
  };

  const removeLanguage = (id: string) => {
    onUpdate(languages.filter((l) => l.id !== id));
  };

  const updateProficiency = (
    id: string,
    proficiency: Language["proficiency"]
  ) => {
    onUpdate(languages.map((l) => (l.id === id ? { ...l, proficiency } : l)));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Looking good. Next, tell us which languages you speak.
      </h2>
      <p className="text-gray-600 mb-8">
        Upwork is global, so clients are often interested to know what languages
        you speak. English is a must, but do you speak any other languages?
      </p>

      <div className="space-y-4 mb-6">
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{language.name}</p>
              <p className="text-sm text-gray-500">
                {language.name === "English" && "(all profiles include this)"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {language.name !== "English" && (
                <button
                  onClick={() => removeLanguage(language.id)}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                >
                  <span className="text-sm">Delete</span>
                </button>
              )}
              <select
                value={language.proficiency}
                onChange={(e) =>
                  updateProficiency(
                    language.id,
                    e.target.value as Language["proficiency"]
                  )
                }
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
              >
                {proficiencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {showAddLanguage ? (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Enter language"
              list="languages-list"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
            />
            <datalist id="languages-list">
              {commonLanguages.map((lang) => (
                <option key={lang} value={lang} />
              ))}
            </datalist>
            <select
              value={newProficiency}
              onChange={(e) =>
                setNewProficiency(e.target.value as Language["proficiency"])
              }
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent"
            >
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={addLanguage}
              className="cursor-pointer px-4 py-2 bg-[#768de8] text-white rounded-lg hover:bg-[#768de8]-dark font-medium"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowAddLanguage(false);
                setNewLanguage("");
              }}
              className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setShowAddLanguage(true);
          }}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          <Plus className="w-5 h-5" />
          Add a language
        </button>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#768de8]-dark"
        >
          Next: set your rate
        </button>
      </div>
    </div>
  );
}
