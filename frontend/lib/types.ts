export type EventType = "event" | "deal"

export type Category = "Food" | "Music" | "Workshop" | "Sale" | "Community Meetup" | "Garage Sale"

export interface Item {
  id: string
  type: EventType
  title: string
  description: string
  category: Category
  startDate: string
  endDate: string
  address: string
  location: {
    lat: number
    lng: number
  }
  image: string
  createdBy: string
  createdAt: string
  updatedAt: string
  distance?: number  // Distance in kilometers from user's location
}

export interface User {
  id: string
  name: string
  email: string
  items?: Item[]
}

export interface FilterOptions {
  category?: Category | null
  dateRange?: {
    start: Date | null
    end: Date | null
  } | null
  type?: EventType | null
  searchTerm?: string
  location?: {
    lat: number
    lng: number
  } | null
  radius?: number
  createdBy?: string  // Added to filter items by creator
}
/**
 * Represents the result of a single environment status check
 */
export interface StatusCheck {
  /**
   * Name of the check performed
   */
  name: string;
  
  /**
   * Status result of the check
   */
  status: 'ok' | 'warning' | 'error';
  
  /**
   * Human-readable message describing the check result
   */
  message: string;
}

/**
 * Comprehensive report of all status checks
 */
export interface StatusReport {
  /**
   * Array of individual check results
   */
  checks: StatusCheck[];
  
  /**
   * Summary counts of check statuses
   */
  summary: {
    ok: number;
    warnings: number;
    errors: number;
  };
  
  /**
   * Timestamp when the report was generated
   */
  timestamp: number;
}

/**
 * Configuration options for the status checker
 */
export interface StatusCheckerOptions {
  /**
   * Root directory of the project to check
   */
  projectRoot?: string;
  
  /**
   * Custom environment variables to check for
   */
  requiredEnvVars?: string[];
  
  /**
   * Custom files to check for
   */
  requiredFiles?: string[];
  
  /**
   * Custom ports to check availability
   */
  portsToCheck?: number[];
}
