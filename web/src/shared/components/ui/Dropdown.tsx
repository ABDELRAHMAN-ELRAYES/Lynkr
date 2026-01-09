import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect?: (option: DropdownOption) => void;
  rightIcon?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select option",
  onSelect,
  rightIcon,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between px-3 py-2 
          bg-global-5 border border-primary rounded-lg 
          text-sm font-inter font-normal text-global-1
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7682e8]
        "
      >
        <span className={selectedOption ? 'text-global-1' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {rightIcon && (
          <img 
            src={rightIcon} 
            alt="dropdown arrow" 
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="
          absolute top-full left-0 right-0 mt-1 
          bg-global-5 border border-primary rounded-lg shadow-lg z-50
          max-h-60 overflow-y-auto
        ">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="
                w-full px-3 py-2 text-left text-sm font-inter font-normal text-global-1
                hover:bg-global-3 focus:outline-none focus:bg-global-3
                first:rounded-t-lg last:rounded-b-lg
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;