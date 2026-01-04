import React, { useState } from 'react';

interface SearchViewProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
}

const SearchView: React.FC<SearchViewProps> = ({
  placeholder = "Search...",
  onSearch,
  leftIcon,
  rightIcon,
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative flex items-center bg-global-5 border border-primary rounded-lg ${className}`}>
      {leftIcon && (
        <img 
          src={leftIcon} 
          alt="search" 
          className="absolute left-3 w-4 h-5 z-10"
        />
      )}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`
          w-full py-2.5 px-4 text-base font-inter font-normal text-global-1 
          placeholder-searchview-text1 bg-transparent border-0 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent
          ${leftIcon ? 'pl-10' : 'pl-4'}
          ${rightIcon ? 'pr-12' : 'pr-9'}
        `}
      />
      {rightIcon && (
        <img 
          src={rightIcon} 
          alt="filter" 
          className="absolute right-3 w-6 h-5 cursor-pointer hover:opacity-70"
        />
      )}
    </div>
  );
};

export default SearchView;