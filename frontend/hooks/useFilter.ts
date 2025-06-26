import { useState, useCallback } from 'react';
import { FilterState } from '../types/event';

export const useFilter = (initialState: FilterState = { categories: [] }) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const updateCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ categories: [] });
  }, []);

  const hasActiveFilters = filters.categories.length > 0;

  return {
    filters,
    updateCategories,
    clearFilters,
    hasActiveFilters
  };
};
