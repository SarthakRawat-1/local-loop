"use client"

import type React from "react"


import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedToken = localStorage.getItem("token")
          if (storedToken) {
            setToken(storedToken)
            // Fetch user profile with the token
            const response = await fetch("http://localhost:8000/api/auth/profile", {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            })
            
            if (response.ok) {
              const userData = await response.json()
              setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
              })
            } else {
              // Token is invalid, clear it
              localStorage.removeItem("token")
              setToken(null)
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("username", email) // FastAPI OAuth2 expects 'username'
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()
      setToken(data.access_token)
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token)
      }

      // Fetch user profile with the token
      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const userData = await profileResponse.json()
      const userProfile = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      }

      setUser(userProfile)
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Signup failed")
      }

      const data = await response.json()
      setToken(data.access_token)
      
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token)
      }

      // Create user object from signup data
      const userProfile = {
        id: "new-user", // We'll update this when we fetch the profile
        name: name,
        email: email,
      }

      setUser(userProfile)

      // Fetch user profile to get the actual ID
      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (profileResponse.ok) {
        const userData = await profileResponse.json()
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
        })
      }

      router.push("/")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    router.push("/login")
  }
  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading, token }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
