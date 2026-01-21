import {
  BookOpen,
  Users,
  Code,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const CasesSection = () => {
  return (
    <section className="px-4 lg:px-24 py-16 lg:py-24">
      <div className="max-w-[90rem] mx-auto text-center">
        <h2
          className="text-5xl lg:text-7xl font-bold text-black mb-8"
          style={{ fontFamily: "Inter" }}
        >
          Discover by Use Case
        </h2>
        <p
          className="text-xl text-gray-600 mb-16"
          style={{ fontFamily: "Inter" }}
        >
          Find the perfect expert for your specific needs
        </p>
        <div className="rounded-2xl flex gap-8 min-h-[40rem]">
          {/* Left Column - Flex 2 */}
          <div className="rounded-2xl flex-2 flex flex-col gap-8">
            {/* Top Card - Research Success Story */}
            <div className="rounded-2xl flex-1 bg-[#ccd0f5] p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <BookOpen className="w-8 h-8 text-[#768de8] opacity-20" />
              </div>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/30 rounded-full px-3 py-1 text-sm font-medium text-[#4a5568] mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Research Field
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d3748] mb-3">
                    Literature Review Completed in 48 Hours
                  </h3>
                  <p className="text-[#4a5568] text-sm leading-relaxed mb-4">
                    Dr. Sarah helped complete a comprehensive systematic review
                    covering 150+ papers for a PhD thesis.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">5.0</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#4a5568]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">48h delivery</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[#768de8] hover:text-[#5a67d8] transition-colors">
                    <span className="text-sm font-medium">View Case</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row - Two Cards */}
            <div className="rounded-2xl flex-1 flex gap-8">
              {/* Teaching Success */}
              <div className="rounded-2xl flex-1 border border-[#768de8] p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[#ccd0f5] rounded-lg">
                      <Users className="w-5 h-5 text-[#768de8]" />
                    </div>
                    <span className="text-sm font-medium text-[#768de8]">
                      Teaching Field
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2d3748] mb-3">
                    SAT Score Improved by 300 Points
                  </h3>
                  <p className="text-[#4a5568] text-sm mb-4 flex-1">
                    Online tutoring sessions helped student achieve dream
                    university admission.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-[#768de8] rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-[#ccd0f5] rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-[#4a5568]">
                      Student & Tutor
                    </span>
                  </div>
                </div>
              </div>

              {/* Engineering Project */}
              <div className="rounded-2xl flex-1 bg-[#ccd0f5] p-6 relative">
                <div className="absolute top-3 right-3">
                  <Code className="w-6 h-6 text-[#768de8] opacity-30" />
                </div>
                <div className="h-full flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-white/40 rounded-full px-3 py-1 text-xs font-medium text-[#4a5568] mb-3 w-fit">
                    Engineering
                  </div>
                  <h3 className="text-lg font-bold text-[#2d3748] mb-3">
                    Full-Stack Web App
                  </h3>
                  <p className="text-[#4a5568] text-sm mb-4 flex-1">
                    Built complete e-commerce platform with React & Node.js in 2
                    weeks.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-[#4a5568]">Completed</span>
                    </div>
                    <span className="text-xs font-semibold text-[#768de8]">
                      $2,500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Card - Main Feature */}
          <div className="rounded-2xl flex-1 border border-[#768de8] p-8 bg-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ccd0f5] rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#768de8] rounded-full opacity-10"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ccd0f5] rounded-2xl mb-4">
                  <TrendingUp className="w-8 h-8 text-[#768de8]" />
                </div>
                <h3 className="text-2xl font-bold text-[#2d3748] mb-2">
                  Platform Growth
                </h3>
                <p className="text-[#4a5568] text-sm">
                  Connecting students and professionals worldwide
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#768de8] mb-1">
                    10,000+
                  </div>
                  <div className="text-sm text-[#4a5568]">Active Users</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#768de8] mb-1">
                    5,000+
                  </div>
                  <div className="text-sm text-[#4a5568]">
                    Projects Completed
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#768de8] mb-1">
                    98%
                  </div>
                  <div className="text-sm text-[#4a5568]">Success Rate</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e2e8f0]">
                <div className="flex items-center justify-center gap-2 text-[#768de8]">
                  <span className="text-sm font-medium">
                    Join thousands of satisfied users
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="rounded-2xl flex-1 flex flex-col gap-8">
            {/* Top Card - Testimonial */}
            <div className="rounded-2xl flex-1 bg-[#ccd0f5] p-8 relative">
              <div className="absolute top-4 left-4">
                <div className="w-1 h-12 bg-[#768de8] rounded-full opacity-30"></div>
              </div>
              <div className="h-full flex flex-col justify-between pl-6">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-[#2d3748] font-medium text-lg leading-relaxed mb-4">
                    "The quality of work exceeded my expectations. Professional,
                    timely, and exactly what I needed."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#768de8] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#2d3748] text-sm">
                      John Davis
                    </div>
                    <div className="text-[#4a5568] text-xs">
                      PhD Student, MIT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card - CTA */}
            <div className="rounded-2xl flex-1 bg-[#768de8] p-8 text-white relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/20 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border border-white/10 rounded-full"></div>

              <div className="relative z-10 h-full flex flex-col justify-center text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-3">
                    Ready to Start Your Project?
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Join thousands of students and professionals who trust our
                    platform for their academic and technical needs.
                  </p>
                </div>

                <button className="bg-white text-[#768de8] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2 mx-auto">
                  Get Started Today
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CasesSection;
