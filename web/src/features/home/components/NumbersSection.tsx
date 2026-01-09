import Button from "@/shared/components/ui/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

const statsData = [
  {
    id: "item-1",
    title: "Vetted Academic Experts",
    description:
      "Our network consists of rigorously vetted professionals from top-tier academic institutions and leading industry sectors, ensuring you receive unparalleled expertise and insights.",
  },
  {
    id: "item-2",
    title: "Successful Projects Delivered",
    description:
      "From PhD dissertations to complex HVAC system designs, our specialists have successfully guided over a thousand projects, turning ambitious goals into tangible realities.",
  },
  {
    id: "item-3",
    title: "Client Satisfaction Rate",
    description:
      "We pride ourselves on outcomes. With a 98% satisfaction rate, the vast majority of our clients report that the service they received met or exceeded their expectations.",
  },
];

const NumbersSection = () => {
  return (
    <section className="px-4 lg:px-24 py-16 lg:py-24">
      <div className="max-w-[90rem] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Button className="h-10 cursor-pointer font-inter px-12 bg-global-1 hover:bg-global-1/90 text-white text-[14px] rounded-full">
              Join the revolution
            </Button>
            <h2 className="text-5xl lg:text-7xl font-medium text-black">
              Excellence by the Numbers
            </h2>
            <p className="text-xl font-inter lg:text-2xl text-gray-600 font-light">
              We connect brilliant minds to solve complex challenges in academia
              and engineering. See the impact of our expert network.
            </p>
          </div>

          <div className="relative">
            {/* Stats visualization */}
            <div className="relative flex items-center justify-center">
              {/* Large circle */}
              <div className="w-80 h-80 rounded-full bg-global-1 flex items-center justify-center relative">
                <span className="text-6xl font-bold text-white">1,200+</span>
              </div>

              {/* Medium circle */}
              <div className="absolute -bottom-8 -right-0 w-48 h-48 rounded-full bg-black flex items-center justify-center">
                <span className="text-5xl font-bold text-white">98%</span>
              </div>

              {/* Small circle */}
              <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-global-2 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">350+</span>
              </div>

              {/* Tiny circle */}
              <div className="absolute -top-4 -right-0 w-32 h-32 rounded-full bg-global-2 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">40+</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto mt-20">
          <Accordion 
            type="single" 
            collapsible 
            defaultValue="item-1" 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {statsData.map((stat) => (
              <AccordionItem 
                value={stat.id} 
                key={stat.id}
                className="border-2 rounded-lg p-4 bg-[#7682e8] border-[#7682e8] data-[state=open]:bg-white data-[state=open]:border-[#7682e8] transition-colors h-fit"
              >
                <AccordionTrigger className="group text-xl text-left font-semibold hover:no-underline py-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center mr-3 rounded-full bg-white group-data-[state=open]:bg-[#7682e8] transition-colors">
                      <span className="text-sm font-bold text-[#7682e8] group-data-[state=open]:text-white transition-colors">
                        {stat.id === "item-1" ? "1" : stat.id === "item-2" ? "2" : "3"}
                      </span>
                    </div>
                    <span className="text-white group-data-[state=open]:text-black transition-colors">
                      {stat.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg text-muted-foreground pt-4">
                  {stat.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;