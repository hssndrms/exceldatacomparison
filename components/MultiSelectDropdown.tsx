import React, { useState, useRef, useEffect, useMemo } from 'react';

interface MultiSelectDropdownProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  disabled: boolean;
  disabledOptions?: string[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange, placeholder, disabled, disabledOptions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (disabledOptions.includes(option)) return;

    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(o => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const selectableOptions = useMemo(() => options.filter(o => !disabledOptions.includes(o)), [options, disabledOptions]);
  
  const allSelectableSelected = useMemo(() => 
    selectableOptions.length > 0 && selectableOptions.every(o => selectedOptions.includes(o)),
    [selectableOptions, selectedOptions]
  );

  const handleToggleAll = () => {
    if (allSelectableSelected) {
      // Deselect all selectable options, keeping disabled/locked ones selected
      onChange(selectedOptions.filter(o => !selectableOptions.includes(o)));
    } else {
      // Select all selectable options
      onChange([...new Set([...selectedOptions, ...selectableOptions])]);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
      >
        <span className="truncate text-gray-700 dark:text-gray-200">
          {selectedOptions.length > 0 ? `${selectedOptions.length} adet seçildi` : placeholder}
        </span>
        <svg className={`w-5 h-5 ml-2 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
             <button
              type="button"
              onClick={handleToggleAll}
              className="w-full text-left text-sm px-2 py-1 rounded text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectableOptions.length === 0}
            >
              {allSelectableSelected ? 'Tüm Seçimi Kaldır' : 'Tümünü Seç'}
            </button>
          </div>
          <ul className="py-1 max-h-52 overflow-auto">
            {options.map(option => {
              const isDisabled = disabledOptions.includes(option);
              return (
                <li
                  key={option}
                  onClick={isDisabled ? undefined : () => toggleOption(option)}
                  className={`flex items-center px-4 py-2 ${isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-700/50' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    readOnly
                    disabled={isDisabled}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 pointer-events-none"
                  />
                  <span className="ml-3 text-gray-900 dark:text-gray-100">{option}</span>
                </li>
              );
            })}
             {options.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Seçenek yok.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
