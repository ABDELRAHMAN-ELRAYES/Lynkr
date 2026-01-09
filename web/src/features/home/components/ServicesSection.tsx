import Button from "@/shared/components/ui/Button";

const ServicesSection = () => {
  return (
    <section className="px-4 lg:px-24 py-16 lg:py-24"> {/* Added a light background for contrast */}
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-8">
          <h2 className="font-inter text-6xl lg:text-8xl font-semibold text-gray-900 leading-tight">
            Services
          </h2>

          <div className="flex flex-col max-w-2xl mt-8">
            <p className="text-xl font-inter lg:text-2xl text-gray-600 font-light">
              Whether you're learning a new skill, launching a project, or
              scaling your business, we offer end-to-end solutions that connect
              you to talent and knowledge seamlessly.
            </p>

            <Button
              className="cursor-pointer font-inter max-w-fit h-[3.5rem] px-10 bg-[#7682e8] mt-10 text-white text-[16px] rounded-full shadow-lg transition duration-300 ease-in-out"
            >
              View All Services
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Service Card 1 */}
          <div className="min-h-[35rem] relative rounded-3xl overflow-hidden h-[420px] shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out bg-white">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/899a8098ef0b007728c5b449fcfdd3d2d83f321a?width=886"
              alt="Marketing and Branding Service"
              className="w-full h-2/3 object-cover rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> {/* Subtle gradient overlay */}
            
            <div className="p-8 absolute bottom-0 left-0 right-0">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                  Marketing
                </span>
                <span className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                  Branding
                </span>
              </div>
              <p className="text-lg text-indigo-200 font-light mb-1">
                VENTURE CAPITAL
              </p>
              <h3 className="text-3xl font-bold text-white leading-tight">
                Research
              </h3>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="min-h-[35rem] mt-[5rem]  relative rounded-3xl overflow-hidden h-[420px] shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out bg-white">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/5ff4b9407fec16f5b6de714c11bb7fbe251dd509?width=890"
              alt="Coming Soon Service"
              className="w-full h-2/3 object-cover rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="p-8 absolute bottom-0 left-0 right-0">
              <span className="px-5 py-2 bg-white text-[#7682e8] text-sm font-semibold rounded-full mb-4 inline-block shadow-md">
                Coming Soon
              </span>
              <p className="text-lg text-indigo-200 font-light mb-1">
                INNOVATION LABS
              </p>
              <h3 className="text-3xl font-bold text-white leading-tight">
                Courses
              </h3>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="min-h-[35rem] mt-[10rem] relative rounded-3xl overflow-hidden h-[420px] shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out bg-white">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/905ad43363db0403ca35642582c8e176f0952fbb?width=890"
              alt="Full Stack Service"
              className="w-full h-2/3 object-cover rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="p-8 absolute bottom-0 left-0 right-0">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                  Marketing
                </span>
                <span className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                  Website
                </span>
                <span className="px-5 py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                  Branding
                </span>
              </div>
              <p className="text-lg text-indigo-200 font-light mb-1">
                DIGITAL TRANSFORMATION
              </p>
              <h3 className="text-3xl font-bold text-white leading-tight">
                Engineering Projects
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ServicesSection;