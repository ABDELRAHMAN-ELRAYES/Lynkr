export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  fromYear: string;
  toYear: string;
  description: string;
}
export interface EducationAPI {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  description?: string;
}
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  currentlyWorking: boolean;
  description?: string;
}

export interface ExperienceAPI {
  title: string;
  company: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export type ServiceTypes = "ENGINEERING" | "WRITING" | "TUTORING";
export type LanguageProficiencyType =
  | "BASIC"
  | "CONVERSATIONAL"
  | "FLUENT"
  | "NATIVE";
export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiencyType;
}

export interface FormData {
  serviceId: string;
  serviceType: ServiceTypes;
  skills: string[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  hourlyRate: string;
  title: string;
  bio: string;
}

const currentFormDataSample = {
  serviceId: "d8c97b92-f565-4fdc-94a4-3a1944f9cc7a",
  skills: [
    "Academic Translation",
    "Plagiarism Checking",
    "Citation Management",
    "Technical Writing",
    "hello",
  ],
  education: [
    {
      id: "1760334943578",
      school: "Kafrelshiekh university",
      degree: "Bachelor's",
      fieldOfStudy: "Computer Science",
      fromYear: "2014",
      toYear: "2024",
      description: "Something",
    },
  ],
  experience: [
    {
      id: "1760334850221",
      title: "software engineer",
      company: "Microsoft",
      location: "london",
      country: "Egypt",
      startMonth: "March",
      startYear: "2014",
      endMonth: "December",
      endYear: "2020",
      currentlyWorking: false,
      description: "somehitng",
    },
    {
      id: "1760334883447",
      title: "Fullstack Software Engineer",
      company: "Google",
      location: "Londong",
      country: "Country",
      startMonth: "December",
      startYear: "2025",
      endMonth: "December",
      endYear: "",
      currentlyWorking: true,
      description: "Great experience",
    },
  ],
  languages: [
    {
      id: "1",
      name: "English",
      proficiency: "FLUENT",
    },
    {
      id: "1760334986675",
      name: "Arabic",
      proficiency: "NATIVE",
    },
  ],
  hourlyRate: "100",
  title: "Software Engineer",
  bio: "I am a software engineer who is passion about tech and growth, i am currently working on some projects but i gain amount of knowledge",
};
