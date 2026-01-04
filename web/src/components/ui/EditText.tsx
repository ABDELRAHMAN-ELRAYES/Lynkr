import React, { useState } from 'react';

interface EditTextProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

const EditText: React.FC<EditTextProps> = ({
  placeholder = "Enter text...",
  value = '',
  onChange,
  type = 'text',
  disabled = false,
  multiline = false,
  rows = 3,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const baseClasses = `
    w-full px-3 py-3 text-base font-inter font-normal text-global-1
    placeholder-searchview-text1 bg-global-5 border border-primary rounded-lg
    focus:outline-none focus:ring-2 focus:ring-global-1 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  if (multiline) {
    return (
      <textarea
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} resize-vertical ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    />
  );
};

export default EditText;