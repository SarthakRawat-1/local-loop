import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { EVENT_CATEGORIES } from '../../utils/constants';

interface EventCategoryFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  availableCategories?: string[];
  className?: string;
}

export const EventCategoryFilter: React.FC<EventCategoryFilterProps> = ({
  selectedCategories,
  onCategoriesChange,
  availableCategories = EVENT_CATEGORIES,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    onCategoriesChange(updated);
  };

  const handleRemoveCategory = (category: string) => {
    onCategoriesChange(selectedCategories.filter(cat => cat !== category));
  };

  const clearAllFilters = () => {
    onCategoriesChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter size={16} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Categories</span>
        {selectedCategories.length > 0 && (
          <Badge variant="filter">
            {selectedCategories.length}
          </Badge>
        )}
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Filter by Category</h3>
              {selectedCategories.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 flex-1">{category}</span>
                  <span className="text-xs text-gray-400">
                    {/* You can add event count here later */}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="selected"
              onRemove={() => handleRemoveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
