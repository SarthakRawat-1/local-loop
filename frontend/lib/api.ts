import type { Item, FilterOptions, User } from "@/lib/types";
import { mockItems } from "@/lib/mock-data";

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to build query string from filter options
const buildQueryString = (filters?: FilterOptions): string => {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.type) {
    params.append("type", filters.type);
  }

  if (filters.searchTerm) {
    params.append("search", filters.searchTerm);
  }

  if (filters.dateRange?.start) {
    params.append("start_date", filters.dateRange.start.toISOString());
  }

  if (filters.dateRange?.end) {
    params.append("end_date", filters.dateRange.end.toISOString());
  }

  // Add createdBy parameter if available
  if (filters.createdBy) {
    params.append("created_by", filters.createdBy);
  }

  // Add location parameters if available
  if (filters.location) {
    params.append("lat", filters.location.lat.toString());
    params.append("lng", filters.location.lng.toString());

    if (filters.radius) {
      params.append("radius", filters.radius.toString());
    }
  }

  return params.toString() ? `?${params.toString()}` : "";
};

// Get auth headers for authenticated requests
const getAuthHeaders = (): HeadersInit => {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// API client functions
export const api = {
  // Items (Events & Deals)
  items: {
    // Get all items with optional filtering
    getAll: async (filters?: FilterOptions): Promise<Item[]> => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/items`,
          // `${API_BASE_URL}/api/items${buildQueryString(filters)}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch items");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
      }
    },

    // Get a single item by ID
    getById: async (id: string): Promise<Item> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch item");
        }

        return await response.json();
      } catch (error) {
        console.error(`Error fetching item ${id}:`, error);
        throw error;
      }
    },

    // Create a new item
    create: async (
      item: Omit<Item, "id" | "createdAt" | "updatedAt" | "createdBy">
    ): Promise<Item> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to create item");
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating item:", error);
        throw error;
      }
    },

    // Update an existing item
    update: async (id: string, item: Partial<Item>): Promise<Item> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update item");
        }

        return await response.json();
      } catch (error) {
        console.error(`Error updating item ${id}:`, error);
        throw error;
      }
    },

    // Delete an item
    delete: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete item");
        }
      } catch (error) {
        console.error(`Error deleting item ${id}:`, error);
        throw error;
      }
    },
  },

  // Authentication
  auth: {
    // Login
    login: async (
      email: string,
      password: string
    ): Promise<{ user: User; token: string }> => {
      try {
        const formData = new FormData();
        formData.append("username", email); // FastAPI OAuth2 expects 'username'
        formData.append("password", password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Login failed");
        }

        const data = await response.json();
        const token = data.access_token;

        // Fetch user profile with the token
        const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await profileResponse.json();

        return {
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          },
          token: token,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    // Signup
    signup: async (
      name: string,
      email: string,
      password: string
    ): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Signup failed");
        }

        const data = await response.json();
        const token = data.access_token;

        // Create user object from signup data
        const user = {
          id: "new-user", // We'll update this when we fetch the profile
          name: name,
          email: email,
        };

        // Fetch user profile to get the actual ID
        const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          user.id = userData.id;
        }

        return {
          user,
          token,
        };
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to get profile");
        }

        const userData = await response.json();
        return {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        };
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
    },

    // Update user profile
    updateProfile: async (profile: Partial<User>): Promise<User> => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to update profile");
        }

        return await response.json();
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
  },

  // File uploads
  uploads: {
    // Upload an image
    uploadImage: async (file: File): Promise<string> => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const response = await fetch(`${API_BASE_URL}/uploads`, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to upload image");
        }

        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    },
  },
};
