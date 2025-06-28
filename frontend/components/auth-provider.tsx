"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
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
  socialLogin: (name: string, email: string) => Promise<void>
  socialSignup: (name: string, email: string) => Promise<void>
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
          setToken(storedToken)
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
            localStorage.removeItem("token")
            setToken(null)
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
      formData.append("username", email)
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
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)

      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!profileResponse.ok) throw new Error("Failed to fetch user profile")

      const userData = await profileResponse.json()
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })

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
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)

      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!profileResponse.ok) throw new Error("Failed to fetch user profile")

      const userData = await profileResponse.json()
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })

      router.push("/")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (name: string, email: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/auth/oauth-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Social login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)

      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!profileResponse.ok) throw new Error("Failed to fetch user profile")

      const userData = await profileResponse.json()
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })

      router.push("/")
    } catch (error) {
      console.error("Social login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const socialSignup = async (name: string, email: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/auth/oauth-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Social signup failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)

      const profileResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!profileResponse.ok) throw new Error("Failed to fetch user profile")

      const userData = await profileResponse.json()
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })

      router.push("/")
    } catch (error) {
      console.error("Social signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        socialLogin,
        socialSignup,
        logout,
        isLoading,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
