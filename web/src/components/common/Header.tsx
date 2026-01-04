import React from 'react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`w-full bg-global-5 border-b border-global-3 ${className}`}>
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-row justify-between items-center py-4">
          {/* Left side - Breadcrumb */}
          <div className="flex flex-row gap-4 justify-center items-center">
            <img 
              src="/images/img_frame.svg" 
              alt="frame" 
              className="w-[14px] h-[16px]"
            />
            <div className="flex flex-row gap-2 justify-center items-center">
              <span className="text-sm font-inter font-normal text-global-5">
                Dashboard
              </span>
              <img 
                src="/images/img_arrow_right.svg" 
                alt="arrow" 
                className="w-[6px] h-[12px]"
              />
              <span className="text-sm font-inter font-normal text-global-5">
                Active Requests
              </span>
              <img 
                src="/images/img_arrow_right.svg" 
                alt="arrow" 
                className="w-[6px] h-[12px]"
              />
              <span className="text-sm font-inter font-normal text-global-1">
                Heat Exchanger Optimization
              </span>
            </div>
          </div>

          {/* Right side - Status and Link */}
          <div className="flex flex-row gap-3 justify-center items-center">
            <Button
              variant="secondary"
              size="sm"
              className="px-3 py-1 text-sm font-inter font-normal text-global-3 bg-global-3 rounded-[14px]"
            >
              In Progress
            </Button>
            <img 
              src="/images/img_button.svg" 
              alt="button" 
              className="w-[20px] h-[32px] cursor-pointer hover:opacity-70"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;