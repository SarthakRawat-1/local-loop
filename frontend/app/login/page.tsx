"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password_input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID


  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="container py-8 min-h-screen bg-gray-50 dark:bg-[#010817]">
      <div className="mx-auto max-w-2xl bg-white dark:bg-[#010817] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-[#010817] dark:text-white">
            Login to Your Account
          </h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-primary-800 dark:text-blue-400 border-b border-gray-200 dark:border-gray-600 pb-2 text-center">
              Account Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#020817] border-gray-300 dark:border-gray-600 text-[#010817] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <Input

                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border-input"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Sign up
                </Link>
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto order-1 sm:order-2 bg-primary-600 hover:bg-primary-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </form>

        {/* Social Login Section */}
        {(googleClientId || githubClientId) && (
          <div className="my-6 border-t border-gray-200 dark:border-gray-600 pt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Or continue with</p>
            <div className="flex justify-center gap-4">
              {googleClientId && (
                <Button
                  variant="outline"
                  onClick={() => signIn("google")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </Button>
              )}
              {githubClientId && (
                <Button
                  variant="outline"
                  onClick={() => signIn("github")}
                  className="flex items-center gap-2"
                >
                  <img
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    alt="GitHub"
                    className="w-5 h-5 bg-white rounded-full"
                  />
                  GitHub
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
