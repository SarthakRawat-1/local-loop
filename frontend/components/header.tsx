"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Plus, Calendar, Tag, Home, Sun, Moon } from "lucide-react";

import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

    const { theme, setTheme } = useTheme();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <>
    {/* Haurger menu for mobile (min-width: 768px and belmbow) */}
    <div className="md:hidden flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/events" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/deals" className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              Deals
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/submit" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </DropdownMenuItem>
          {user ? (
            <>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center">
                Login
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center"
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4 text-blue-600" />
                Dark Mode
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 max-[768px]:hidden backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary-600">
                LocalLoop
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary-600 flex items-center ${isActive("/") ? "text-primary-600" : "text-muted-foreground"}`}
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors hover:text-primary-600 flex items-center ${isActive("/events") ? "text-primary-600" : "text-muted-foreground"}`}
            >
              <Calendar className="mr-1 h-4 w-4" />
              Events
            </Link>
            <Link
              href="/deals"
              className={`text-sm font-medium transition-colors hover:text-primary-600 flex items-center ${isActive("/deals") ? "text-primary-600" : "text-muted-foreground"}`}
            >
              <Tag className="mr-1 h-4 w-4" />
              Deals
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/submit">
              <Button
                variant="default"
                size="sm"
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add New</span>
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Theme Toggle Button - Fixed Position */}
            <div className="z-50">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-600" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header></>
  );
}
