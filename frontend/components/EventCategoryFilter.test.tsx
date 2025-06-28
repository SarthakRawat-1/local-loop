import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCategoryFilter } from '../../components/filters/EventCategoryFilter';

describe('EventCategoryFilter', () => {
  const mockOnCategoriesChange = jest.fn();

  beforeEach(() => {
    mockOnCategoriesChange.mockClear();
  });

  it('renders filter button', () => {
    render(
      <EventCategoryFilter
        selectedCategories={[]}
        onCategoriesChange={mockOnCategoriesChange}
      />
    );
    
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', () => {
    render(
      <EventCategoryFilter
        selectedCategories={[]}
        onCategoriesChange={mockOnCategoriesChange}
      />
    );
    
    fireEvent.click(screen.getByText('Categories'));
    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
  });

  it('calls onCategoriesChange when category is selected', () => {
    render(
      <EventCategoryFilter
        selectedCategories={[]}
        onCategoriesChange={mockOnCategoriesChange}
      />
    );
    
    fireEvent.click(screen.getByText('Categories'));
    fireEvent.click(screen.getByLabelText(/Sports/));
    
    expect(mockOnCategoriesChange).toHaveBeenCalledWith(['Sports']);
  });
});
