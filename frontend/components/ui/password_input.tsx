import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState} from "react"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePassword = () => setShowPassword((prev) => !prev)

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={togglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
})

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
