export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  price?: number;
  organizer: string;
}

export interface FilterState {
  categories: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: {
    radius: number;
    center: {
      latitude: number;
      longitude: number;
    };
  };
}
