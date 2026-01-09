"use client";

import { useEffect, useState } from "react";
import type { FormData } from "@/shared/types/signup-process-types";
import Header from "@/features/auth/components/signup-process/header";
import ProgressBar from "@/features/auth/components/signup-process/progress-bar";
import ServiceTypeStep from "@/features/auth/components/signup-process/steps/service-step";
import SkillsStep from "@/features/auth/components/signup-process/steps/skill-step";
import ExperienceStep from "@/features/auth/components/signup-process/steps/experience-step";
import EducationStep from "@/features/auth/components/signup-process/steps/education-step";
import LanguagesStep from "@/features/auth/components/signup-process/steps/language-step";
import HourlyRateStep from "@/features/auth/components/signup-process/steps/hour-rate-step";
import BioStep from "@/features/auth/components/signup-process/steps/bio-step";
import { LoadingModal } from "@/shared/components/common/loading-modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/use-auth";
import { toast } from "sonner";

function ProviderApplyPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceId: "",
    serviceType: "ENGINEERING",
    skills: [],
    education: [],
    experience: [],
    languages: [{ id: "1", name: "English", proficiency: "NATIVE" }],
    hourlyRate: "",
    title: "",
    bio: "",
  });
  const navigate = useNavigate();
  const [loadingModal, setLoadingModal] = useState(false);
  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 2000);
  };

  const totalSteps = 7;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  useEffect(() => {
    document.title = "Lynkr | Provider Application";
    if (!user || user.role != "PENDING_PROVIDER") {
      toast.error("You are unauthorized");
      handleRedirect("/signup")();
    }
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceTypeStep
            serviceId={formData.serviceId}
            onUpdate={(serviceId, serviceType) => updateFormData({ serviceId, serviceType })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <SkillsStep
            skills={formData.skills}
            serviceId={formData.serviceId}
            onUpdate={(skills) => updateFormData({ skills })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ExperienceStep
            experience={formData.experience}
            onUpdate={(experience) => updateFormData({ experience })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <EducationStep
            education={formData.education}
            onUpdate={(education) => updateFormData({ education })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <LanguagesStep
            languages={formData.languages}
            onUpdate={(languages) => updateFormData({ languages })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <HourlyRateStep
            hourlyRate={formData.hourlyRate}
            onUpdate={(hourlyRate) => updateFormData({ hourlyRate })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <BioStep
            title={formData.title}
            bio={formData.bio}
            onUpdate={(data) => updateFormData(data)}
            onBack={prevStep}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loadingModal && <LoadingModal />}
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          <div className="mt-8">{renderStep()}</div>
        </div>
      </div>
    </>
  );
}

export default ProviderApplyPage;
