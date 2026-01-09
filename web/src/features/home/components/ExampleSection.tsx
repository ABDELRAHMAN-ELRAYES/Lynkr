import Button from "@/shared/components/ui/Button";
import { Card, CardContent } from "@/shared/components/ui/card";

const ExampleSection = () => {
  return (
    <section className="max-w-[90rem] font-inter mx-auto px-4 lg:px-24 py-16 lg:py-24 bg-global-2 relative overflow-hidden rounded-lg my-[6rem]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-8">
          <h2 className="font-inter text-[4rem] leading-[4rem] font-semibold text-gray-900">
            Transform your financial operations.
          </h2>

          <div className="flex flex-col max-w-[39rem] mt-4">
            <p className="text-xl font-inter lg:text-2xl text-gray-600 font-light">
              Modern businesses need financial solutions that keep up. Our platform offers developer-friendly tools to streamline your financial workflows and boost efficiency.
            </p>

            <Button className="z-[100] cursor-pointer font-inter max-w-fit h-[3.5rem] px-10 bg-[#7682e8] mt-10 text-white text-[16px] rounded-full shadow-lg transition duration-300 ease-in-out">
              Explore Features
            </Button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-end">
          <div className="space-y-8 z-[100]">
            {/* Profile Card */}
            <Card className="w-full max-w-sm bg-white p-6 border-[#ccd0f5]">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center gap-4">
                  <img
                    src="/images/pages/home/small-girl.png"
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="text-gray-600 text-xl font-inter">
                      @FinancialPro
                    </div>
                    <div className="text-black text-xl font-bold font-inter">
                      Senior Financial Analyst
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-global-2"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-global-1 rounded-full"></div>
                    <span className="text-black font-inter">
                      <span className="font-bold">120+</span> financial reports generated
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-global-1 rounded-full"></div>
                    <span className="text-black font-inter">
                      <span className="font-bold">98%</span> client satisfaction rate
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Connect Your Accounts",
                  description: "Securely link your bank accounts, credit cards, and financial platforms in one place."
                },
                {
                  title: "Automate Transactions",
                  description: "Set up rules to automatically categorize transactions and reduce manual data entry."
                },
                {
                  title: "Generate Insights",
                  description: "Get real-time financial analytics and visual reports to understand your cash flow."
                },
                {
                  title: "Optimize Strategy",
                  description: "Use our recommendations to improve financial decisions and maximize your resources."
                }
              ].map((step, index) => (
                <Card key={index} className="bg-white p-8 border-none">
                  <CardContent className="space-y-4 p-0">
                    <div className="space-y-3">
                      <div className="text-xl text-gray-600 font-inter">
                        Step {index + 1}
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-global-1 rounded flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-black leading-[1.5rem] font-inter">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 font-inter">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Person image */}
        <div className="absolute bottom-[4rem] left-[5rem] hidden lg:block z-[50]">
          <img
            src="/images/pages/home/girl.png"
            alt="Person with laptop"
            className="w-[60rem] h-auto object-contain"
          />
        </div>

        {/* Decorative card */}
        <div className="absolute top-[28rem] left-[25rem] transform -translate-y-1/2 rotate-12 hidden lg:block">
          <Card className="bg-global-1 text-white p-6 w-80">
            <CardContent className="space-y-4 p-0">
              <div className="text-xl font-bold font-inter">
                Monthly Savings
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold font-inter">
                  $2,450
                </div>
                <div className="text-right text-xl font-bold font-inter">
                  12.6%
                </div>
              </div>

              <div className="w-full h-1 bg-white/30 rounded">
                <div className="w-2/3 h-full bg-white rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decorative UI element */}
        <div className="absolute top-[11rem] left-[2rem] hidden lg:block">
          <img
            src="/images/pages/home/numbers-chart.png"
            alt="UI element"
            className="w-[30rem] h-auto object-contain transform rotate-[10deg]"
          />
        </div>
      </div>
    </section>
  );
};

export default ExampleSection;