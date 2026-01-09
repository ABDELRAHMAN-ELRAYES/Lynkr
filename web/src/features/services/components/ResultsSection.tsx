import OperationRequestForm from "@/shared/components/common/modals/request-modal";
import { Star, User } from "lucide-react";
import { useState } from "react";

const ResultsSection = () => {
  const professionals = [
    {
      id: 1,
      name: "Dr. Amina Khalid",
      title: "Mechanical Engineering Researcher",
      specialization: "Thermal & CFD Analysis",
      rate: 45,
      rating: 4.9,
      reviews: 127,
      jobSuccess: 98,
      location: "New York, NY",
      description:
        "Experienced academic researcher with 8+ years in computational fluid dynamics and thermal systems modeling. Specializes in ANSYS Fluent, MATLAB, and experimental validation for peer-reviewed publications.",
      skills: ["CFD", "Heat Transfer", "MATLAB", "ANSYS"],
      avatar: "/images/pages/home/small-girl.png",
    },
    {
      id: 2,
      name: "Dr. Emily Santos",
      title: "Research Consultant",
      specialization: "Academic Writing & Publication Support",
      rate: 38,
      rating: 4.8,
      reviews: 89,
      jobSuccess: 95,
      location: "San Francisco, CA",
      description:
        "Specialist in drafting, editing, and formatting research manuscripts for top-tier journals. Extensive experience with APA, IEEE, and Chicago styles.",
      skills: [
        "Academic Writing",
        "Editing",
        "Formatting",
        "Literature Review",
      ],
      avatar: "/images/pages/home/small-girl.png",
    },
    {
      id: 3,
      name: "Prof. Daniel Hart",
      title: "Thesis Advisor",
      specialization: "Data Analysis & Statistical Modelling",
      rate: 52,
      rating: 4.9,
      reviews: 203,
      jobSuccess: 99,
      location: "Austin, TX",
      description:
        "Expert in guiding postgraduate students through research design, data collection, and statistical analysis. Skilled in R, SPSS, and Python for quantitative and qualitative research.",
      skills: ["R", "Data Analysis", "SPSS", "Python"],
      avatar: "/images/pages/home/small-girl.png",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }
  return (
    <>
      <div
        className={`${
          isOpen ? "flex items-center justify-center" : "hidden"
        } fixed inset-0 bg-[#0000007d]  z-[1005]`}
      >
        <OperationRequestForm close={close} isOpen={isOpen} />
      </div>
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            <span className="font-bold">1,247</span> results found
          </h3>
        </div>

        <div className="space-y-6">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-300"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={professional.avatar || "/placeholder.svg"}
                    alt={professional.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 text-left">
                    <div className="mb-2 sm:mb-0">
                      <h4 className="cursor-pointer text-lg font-semibold text-gray-900">
                        {professional.name.split(" ")[0]}{" "}
                        {professional.name.split(" ")[1]}{" "}
                        {professional.name.split(" ")[2][0]}{" "}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {professional.title} | {professional.specialization}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${professional.rate}
                        <span className="text-sm font-normal text-gray-500">
                          /hr
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                    {professional.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4 justify-start">
                    {professional.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {professional.rating}
                        </span>
                        <span>({professional.reviews} reviews)</span>
                      </div>
                      <div>{professional.jobSuccess}% Job Success</div>
                      <div>{professional.location}</div>
                    </div>

                    <div className="flex gap-3 justify-start sm:justify-end">
                      <button className="cursor-pointer p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <User className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="cursor-pointer px-6 py-2 bg-[#7682e8] text-white rounded-lg transition-colors font-medium"
                        onClick={open}
                      >
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultsSection;
