"use client";

import type { Item } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ListViewProps {
  items: Item[];
  loading?: boolean;
}

export function ListView({ items, loading = false }: ListViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          Waiting for location permission...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="text-muted-foreground">
          We couldn't find any items near your location. Try adjusting your
          filters or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link href={`/${item.type}s/${item.id}`} key={item.id}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={
                  item.image
                    ? `http://localhost:8000${item.image}`
                    : "/placeholder.svg"
                }
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Badge
                className={`absolute top-2 right-2 ${
                  item.type === "event" ? "bg-primary-600" : "bg-green-600"
                }`}
              >
                {item.type === "event" ? "Event" : "Deal"}
              </Badge>
              {item.distance !== undefined && (
                <Badge className="absolute bottom-2 left-2 bg-blue-600">
                  {item.distance} km away
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-primary-600 transition-colors duration-300">
                {item.title}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                {item.category}
              </Badge>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {item.description}
                
              </p>
              <div className="flex items-center text-sm mt-2 text-gray-600">
                <Calendar className="w-4 h-4 mr-1 text-primary-600" />
                <span className="line-clamp-1">
                  {formatDate(item.startDate)}
                </span>
              </div>
              <div className="flex items-center text-sm mt-1 text-gray-600">
                <MapPin className="w-4 h-4 mr-1 text-primary-600" />
                <span className="truncate">{item.address}</span>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 border-t pt-3">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Posted {getTimeAgo(item.createdAt)}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
