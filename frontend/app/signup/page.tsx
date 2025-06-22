"use client";

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun } from "lucide-react"
import { signIn } from "next-auth/react"


export default function SignupPage() {
  
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkStrength = async () => {
      if (!password) {
        setPasswordScore(0);
        return;
      }
      const { default: zxcvbn } = await import("zxcvbn");
      const result = zxcvbn(password);
      setPasswordScore(result.score);
    };
    checkStrength();
  }, [password]);

  const getStrengthLabel = (score: number) => {
    return ["Very Weak", "Weak", "Fair", "Good", "Strong"][score];
  };

  const getStrengthColor = (score: number) => {
    return [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ][score];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordScore < 3) {
      toast({
        title: "Weak password",
        description:
          "Password must be stronger. Try using a mix of upper/lowercase, numbers, and symbols.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, email, password);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      router.push("/");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "There was an error creating your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 min-h-screen bg-background">
      <div className="mx-auto max-w-2xl bg-card p-8 rounded-lg shadow-sm border">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create an Account</h1>
          <p className="text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 text-center">
              Account Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="mt-1 space-y-1">
                    <div className="h-2 w-full rounded bg-muted relative">
                      <div
                        className={`absolute top-0 left-0 h-full rounded transition-all duration-300 ${getStrengthColor(
                          passwordScore
                        )}`}
                        style={{
                          width: `${(passwordScore / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Strength:{" "}
                      <span className="font-medium text-foreground">
                        {getStrengthLabel(passwordScore)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto order-1 sm:order-2"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
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
  );
}
