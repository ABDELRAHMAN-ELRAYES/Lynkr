import Footer from "@/shared/components/common/Footer";
import Navbar from "@/shared/components/common/Navbar";
import ScrollVelocity from "@/shared/components/common/imported/scroll-velocity";
import CasesSection from "@/features/home/components/CasesSection";
import ExampleSection from "@/features/home/components/ExampleSection";
import HeroSection from "@/features/home/components/HeroSection";
import NumbersSection from "@/features/home/components/NumbersSection";
import ServicesSection from "@/features/home/components/ServicesSection";
import SupportSection from "@/features/home/components/SupportSection";
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
