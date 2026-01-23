"use client";

import { User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { profileService } from "@/shared/services";
import { CreateFullProfileRequest } from "@/shared/types/profile";
import type { FormData as SignupFormData } from "@/shared/types/auth/signup";

interface BioStepProps {
  title: string;
  bio: string;
  onUpdate: (data: { title?: string; bio?: string }) => void;
  onBack: () => void;
  formData: SignupFormData;
}

export default function BioStep({
  title,
  bio,
  onUpdate,
  onBack,
  formData,
}: BioStepProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_TITLE_LENGTH = 80;
  const MAX_BIO_LENGTH = 350;
  const MIN_BIO_LENGTH = 100;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Transform education data
      const educations = formData.education.length > 0 ? {
        profileEducations: formData.education.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: `${edu.fromYear}-01-01T00:00:00`,
          endDate: `${edu.toYear}-12-31T23:59:59`,
          description: edu.description || '',
        }))
      } : undefined;

      // Transform work history data
      const workHistories = formData.experience.length > 0 ? {
        profileWorkHistories: formData.experience.map(exp => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          country: exp.country,
          startDate: `${exp.startYear}-${getMonthNumber(exp.startMonth)}-01T00:00:00`,
          endDate: exp.currentlyWorking
            ? `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}T23:59:59`
            : `${exp.endYear || exp.startYear}-${getMonthNumber(exp.endMonth || 'December')}-28T23:59:59`,
          description: exp.description || '',
        }))
      } : undefined;

      // Transform language data
      const languages = formData.languages.length > 0 ? {
        profileLanguages: formData.languages.map(lang => ({
          language: lang.name,
          proficiency: lang.proficiency,
        }))
      } : undefined;

      // Build the full profile request
      const requestData: CreateFullProfileRequest = {
        profile: {
          title: title,
          bio: bio,
          hourlyRate: parseFloat(formData.hourlyRate) || 0,
          skills: formData.skills.join(', '),
          serviceId: formData.serviceId, // UUID for service relation
          serviceType: formData.serviceType,
        },
        educations,
        workHistories,
        languages,
      };

      await profileService.submitProfileJoinRequest(requestData);

      toast.success("Application submitted successfully! We'll review your profile and get back to you soon.");

      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error: any) {
      console.error("Profile submission error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName: string): string => {
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    return months[monthName] || '01';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      onUpdate({ title: value });
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO_LENGTH) {
      onUpdate({ bio: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold text-gray-900 mb-2">
        Great. Now write a bio to tell the world about yourself.
      </h2>
      <p className="text-gray-600 mb-8">
        Help people get to know you at a glance. What work do you do best? Tell
        them clearly, using paragraphs or bullet points. You can always edit
        later, just make sure you proofread now.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              disabled={isSubmitting}
              placeholder="Ex: Full Stack Developer | Academic Writer | Math Tutor"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent disabled:bg-gray-100"
            />
            <p className={`text-sm mt-2 ${title.length >= MAX_TITLE_LENGTH ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {title.length}/{MAX_TITLE_LENGTH} characters
              {title.length >= MAX_TITLE_LENGTH && ' - Maximum reached'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={handleBioChange}
              disabled={isSubmitting}
              placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] focus:border-transparent resize-none disabled:bg-gray-100"
            />
            <p className={`text-sm mt-2 ${bio.length >= MAX_BIO_LENGTH ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {bio.length}/{MAX_BIO_LENGTH} characters (minimum {MIN_BIO_LENGTH})
              {bio.length >= MAX_BIO_LENGTH && ' - Maximum reached'}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-1 break-words">
              {title || "Your Professional Title"}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {formData.hourlyRate ? `$${formData.hourlyRate}/hr` : "$0.00/hr"}
            </p>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                {bio
                  ? bio.length <= 250
                    ? bio
                    : `${bio.slice(0, 250)}...`
                  : "Your bio will appear here..."}
              </p>
            </div>

            {formData.skills.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {formData.skills.length > 5 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{formData.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="cursor-pointer px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title || bio.length < MIN_BIO_LENGTH || isSubmitting}
          className="cursor-pointer px-6 py-2.5 bg-[#768de8] text-white rounded-lg font-medium hover:bg-[#667ce0] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Complete Profile'
          )}
        </button>
      </div>
    </div>
  );
}
