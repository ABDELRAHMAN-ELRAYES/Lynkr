import {
  Education,
  EducationAPI,
  Experience,
  ExperienceAPI,
} from "@/types/signup-process-types";

function formatDateToAPI(month: string, year: string): string {
  const monthMap: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const monthNum = monthMap[month] || "01";
  return `${year}-${monthNum}-01 09:00:00`;
}
// Convert education format to the accepted education API request body format
export function transformEducationForAPI(
  education: Education[]
): EducationAPI[] {
  return education.map((edu) => ({
    school: edu.school,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy,
    startDate: `${edu.fromYear}-09-01 00:00:00`,
    endDate: `${edu.toYear}-06-30 00:00:00`,
    description: edu.description,
  }));
}
export function transformExperienceForAPI(
  experience: Experience[]
): ExperienceAPI[] {
  return experience.map((exp) => ({
    title: exp.title,
    company: exp.company,
    location: exp.location,
    country: exp.country,
    startDate: formatDateToAPI(exp.startMonth, exp.startYear),
    endDate: exp.currentlyWorking
      ? formatDateToAPI(
          new Date().toLocaleString("en-US", { month: "long" }),
          new Date().getFullYear().toString()
        )
      : formatDateToAPI(exp.endMonth!, exp.endYear!),
    description: exp.description,
  }));
}
