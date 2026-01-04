import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import ScrollVelocity from "@/components/imported/scroll-velocity";
import CasesSection from "@/components/pages/home/CasesSection";
import ExampleSection from "@/components/pages/home/ExampleSection";
import HeroSection from "@/components/pages/home/HeroSection";
import NumbersSection from "@/components/pages/home/NumbersSection";
import ServicesSection from "@/components/pages/home/ServicesSection";
import SupportSection from "@/components/pages/home/SupportSection";
import { useEffect } from "react";

export default function HomePage() {
  const velocity = 100;
  useEffect(() => {
    document.title = "Lynkr | Home";
  }, []);
  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      <HeroSection />
      <div className="w-full">
        <ScrollVelocity
          texts={["Talents . Engineering . Research . Teaching"]}
          velocity={velocity}
          className="bg-[#7682e8] py-4 px-4 text-white text-3xl custom-scroll-text"
        />
      </div>
      <ServicesSection />
      <div className="max-w-[90rem] h-px bg-global-2 mx-auto"></div>
      <NumbersSection />
      <div className="max-w-[90rem] h-px bg-global-2 mx-auto"></div>
      <ExampleSection />
      <div className="max-w-[90rem] h-px bg-global-2 mx-auto"></div>
      <CasesSection />
      <div className="max-w-[90rem] h-px bg-global-2 mx-auto"></div>
      <SupportSection />
      <div className="max-w-[90rem] h-px bg-global-2 mx-auto"></div>
      <Footer />
    </div>
  );
}
