"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListView } from "@/components/list-view";
import { api } from "@/lib/api";
import type { Item } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }

    if (user) {
      setName(user.name);
      setEmail(user.email);

      const fetchUserItems = async () => {
        setIsLoadingItems(true);
        try {
          const userItems = await api.items.getAll({ createdBy: user.id });
          setUserItems(userItems);
        } catch (error) {
          console.error("Error fetching user items:", error);
          toast({
            title: "Error",
            description: "Failed to load your items",
            variant: "destructive",
          });
        } finally {
          setIsLoadingItems(false);
        }
      };

      fetchUserItems();
    }
  }, [user, authLoading, router, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await api.auth.updateProfile({ name, email });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (authLoading) {
    return (
      <div className="container py-12">
        <div className="text-center text-gray-600 dark:text-gray-300">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">

      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="items"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
          >
            Your Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Update your account information here
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Events & Deals</h2>
              <Button 
                onClick={() => router.push("/submit")}
                className="bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Add New Item
              </Button>
            </div>

            {isLoadingItems ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading your items...</div>
            ) : userItems.length > 0 ? (
              <ListView items={userItems} />
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No items yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven&apos;t created any events or deals yet
                </p>
                <Button 
                  onClick={() => router.push("/submit")}
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Create Your First Item
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}