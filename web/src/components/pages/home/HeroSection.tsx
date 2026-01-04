import React, { useState, useEffect, useRef } from "react";
import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import RotatingText from "@/components/imported/RotatingText";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const containerRef = useRef(null);

  const words = ["Innovation", "Excellence", "Creativity", "Growth", "Success"];


  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden"
    >
      {/* Animated mesh gradient */}
      {/* <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-4 w-72 h-72 bg-[#7682e8] rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-[30%] right-4 w-72 h-72 bg-[#7682e8] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-[30%] w-72 h-72 bg-[#7682e8] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div> */}

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main hero content */}
        <div className="flex flex-col items-center text-center">
          <div>
            <h1 className="flex items-center gap-4 justify-center bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent md:text-[4rem] lg:text-[5rem]">
              <span className="block">Hire for</span>
              <RotatingText
                texts={words}
                mainClassName={`font-pacifico tracking-[0.25rem] px-2 sm:px-2 md:px-3 bg-transparent text-[#7682e8] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg`}
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.102}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={4000}
              />
              ,
            </h1>
            <h1 className="max-w-[90rem] mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold leading-tight tracking-tighter text-transparent md:text-[4rem] lg:text-[5rem]">
              Streamline Your Workflow, Amplify Your Results
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light">
              Connect with the world's top 3% of talent. Quality work delivered
              faster than ever, with built-in project management and guaranteed
              results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mt-12">
            <button className="group relative bg-[#7682e8] h-[3rem] min-w-[12rem] rounded-full text-white px-4 py-2  font-medium transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="bg-white/80 backdrop-blur-sm h-[3rem] min-w-fit rounded-full text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg px-4 py-2  font-medium transition-all duration-300">
              Browse Services
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
