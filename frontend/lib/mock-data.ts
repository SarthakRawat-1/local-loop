import type { Item, Category, EventType } from "@/lib/types"

export const mockItems: Item[] = [
  {
    id: "1",
    type: "event",
    title: "Community Farmers Market",
    description:
      "Join us for the weekly farmers market featuring local produce, crafts, and food vendors. Support local businesses and enjoy fresh, seasonal goods.",
    category: "Food",
    startDate: "2023-06-15T09:00:00Z",
    endDate: "2023-06-15T14:00:00Z",
    address: "123 Market Street, Neighborhood Square",
    location: {
      lat: 40.7128,
      lng: -74.006,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-1",
    createdAt: "2023-06-01T12:00:00Z",
    updatedAt: "2023-06-01T12:00:00Z",
  },
  {
    id: "2",
    type: "event",
    title: "Live Jazz Night",
    description: "Experience an evening of smooth jazz with local musicians. Food and drinks available for purchase.",
    category: "Music",
    startDate: "2023-06-16T19:00:00Z",
    endDate: "2023-06-16T22:00:00Z",
    address: "456 Jazz Avenue, Downtown",
    location: {
      lat: 40.72,
      lng: -74.01,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-2",
    createdAt: "2023-06-02T10:30:00Z",
    updatedAt: "2023-06-02T10:30:00Z",
  },
  {
    id: "3",
    type: "deal",
    title: "50% Off Coffee Shop Grand Opening",
    description: "Celebrate our grand opening with half-price drinks all day! Try our signature blends and pastries.",
    category: "Food",
    startDate: "2023-06-17T07:00:00Z",
    endDate: "2023-06-17T19:00:00Z",
    address: "789 Bean Street, Eastside",
    location: {
      lat: 40.715,
      lng: -74.0,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-3",
    createdAt: "2023-06-03T14:15:00Z",
    updatedAt: "2023-06-03T14:15:00Z",
  },
  {
    id: "4",
    type: "event",
    title: "DIY Craft Workshop",
    description:
      "Learn how to make handmade crafts with recycled materials. All supplies provided. Great for beginners!",
    category: "Workshop",
    startDate: "2023-06-18T13:00:00Z",
    endDate: "2023-06-18T15:00:00Z",
    address: "101 Craft Lane, Westside",
    location: {
      lat: 40.718,
      lng: -74.02,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-4",
    createdAt: "2023-06-04T09:45:00Z",
    updatedAt: "2023-06-04T09:45:00Z",
  },
  {
    id: "5",
    type: "deal",
    title: "Weekend Book Sale - Buy One Get One Free",
    description: "Expand your library with our BOGO deal on all fiction books. Valid this weekend only!",
    category: "Sale",
    startDate: "2023-06-19T10:00:00Z",
    endDate: "2023-06-20T18:00:00Z",
    address: "202 Reader Road, Northside",
    location: {
      lat: 40.725,
      lng: -74.005,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-5",
    createdAt: "2023-06-05T16:20:00Z",
    updatedAt: "2023-06-05T16:20:00Z",
  },
  {
    id: "6",
    type: "event",
    title: "Neighborhood Cleanup Day",
    description:
      "Join your neighbors in keeping our community beautiful. Gloves and bags provided. Lunch served afterward!",
    category: "Community Meetup",
    startDate: "2023-06-21T09:00:00Z",
    endDate: "2023-06-21T12:00:00Z",
    address: "303 Green Street, Southside",
    location: {
      lat: 40.71,
      lng: -74.015,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-6",
    createdAt: "2023-06-06T11:10:00Z",
    updatedAt: "2023-06-06T11:10:00Z",
  },
  {
    id: "7",
    type: "deal",
    title: "Summer Clothing Clearance - Up to 70% Off",
    description:
      "Refresh your wardrobe with our summer clearance sale. Everything must go to make room for fall inventory!",
    category: "Sale",
    startDate: "2023-06-22T10:00:00Z",
    endDate: "2023-06-25T20:00:00Z",
    address: "404 Fashion Boulevard, Downtown",
    location: {
      lat: 40.722,
      lng: -74.008,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-7",
    createdAt: "2023-06-07T13:25:00Z",
    updatedAt: "2023-06-07T13:25:00Z",
  },
  {
    id: "8",
    type: "event",
    title: "Multi-Family Garage Sale",
    description: "Five families selling furniture, clothing, toys, and more. Great deals on gently used items!",
    category: "Garage Sale",
    startDate: "2023-06-26T08:00:00Z",
    endDate: "2023-06-26T16:00:00Z",
    address: "505 Bargain Way, Eastside",
    location: {
      lat: 40.716,
      lng: -73.995,
    },
    image: "/placeholder.svg?height=400&width=600",
    createdBy: "user-8",
    createdAt: "2023-06-08T15:40:00Z",
    updatedAt: "2023-06-08T15:40:00Z",
  },
]

export const categories: Category[] = ["Food", "Music", "Workshop", "Sale", "Community Meetup", "Garage Sale"]

export const eventTypes: { value: EventType; label: string }[] = [
  { value: "event", label: "Events" },
  { value: "deal", label: "Deals" },
]

export const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "thisWeek", label: "This Week" },
  { value: "thisWeekend", label: "This Weekend" },
  { value: "nextWeek", label: "Next Week" },
  { value: "custom", label: "Custom Range" },
]
