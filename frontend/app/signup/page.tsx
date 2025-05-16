"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passStrengthData, setPassStrengthData] = useState({
    hasLength: false,
    hasUpper: false,
    hasLower: false,
    hasSpecialChar: false,
    hasNumber: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const passData = {
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };

    setPassStrengthData(passData);
  }, [password]);

  function checkPasswordStrength(data: Record<string, boolean>): boolean {
    return Object.values(data).every(Boolean);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(password.length < 8){
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
     })
    return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (!checkPasswordStrength(passStrengthData)) {
      toast({
        title: "Weak Password",
        description: "Please enter a strong password",
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
    <div className="container py-8">
      <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg shadow-sm">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-primary-800 border-b pb-2 text-center">
              Account Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-1"
                />
                <div
                  className="mt-4 w-full border border-gray-200 text-xs
                p-4 rounded-lg  space-y-2 "
                >
                  <p className="font-medium ">Your password must contain : </p>
                  <ul className="space-y-1 text-gray-600">
                    <li
                      className={`flex items-center gap-1 ${
                        passStrengthData.hasNumber && "text-green-500"
                      }`}
                    >
                      {passStrengthData.hasNumber ? (
                        <Check className="h-4 w-4 " />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>At least one number (0-9)</span>
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passStrengthData.hasUpper && "text-green-500"
                      }`}
                    >
                      {passStrengthData.hasUpper ? (
                        <Check className="h-4 w-4 " />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>At least one uppercase letter (A-Z)</span>
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passStrengthData.hasLower && "text-green-500"
                      }`}
                    >
                      {passStrengthData.hasLower ? (
                        <Check className="h-4 w-4 " />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>At least one lowercase letter (a-z)</span>
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passStrengthData.hasSpecialChar && "text-green-500"
                      }`}
                    >
                      {passStrengthData.hasSpecialChar ? (
                        <Check className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span>
                        At least one special character ($, %, #, etc.)
                      </span>
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        passStrengthData.hasLength && "text-green-500"
                      }`}
                    >
                      {passStrengthData.hasLength ? (
                        <Check className="h-4 w-4 " />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>minimum number of char is 8</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 order-2 sm:order-1">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
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
      </div>
    </div>
  );
}
