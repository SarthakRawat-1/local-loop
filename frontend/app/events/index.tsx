import React from 'react';
import { EventCategoryFilter } from '../../components/filters';
import { useFilter } from '../../hooks/useFilter';

const EventsPage: React.FC = () => {
  const { filters, updateCategories, clearFilters, hasActiveFilters } = useFilter();

  // Mock events data - replace with actual API call
  const events = [
    { id: 1, title: 'Soccer Match', category: 'Sports', date: '2024-07-01' },
    { id: 2, title: 'Food Festival', category: 'Food & Drink', date: '2024-07-02' },
    // ... more events
  ];

  const filteredEvents = filters.categories.length > 0
    ? events.filter(event => filters.categories.includes(event.category))
    : events;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Local Events</h1>
        <div className="text-sm text-gray-600">
          {filteredEvents.length} events found
        </div>
      </div>
      
      <div className="mb-6">
        <EventCategoryFilter
          selectedCategories={filters.categories}
          onCategoriesChange={updateCategories}
          className="w-full max-w-md"
        />
      </div>

      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Showing events in: {filters.categories.join(', ')}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Show all events
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-1">Category: {event.category}</p>
            <p className="text-gray-600 text-sm">Date: {event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
