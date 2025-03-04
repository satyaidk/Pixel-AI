import type { ButtonHTMLAttributes } from "react"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
}

export default function PixelButton({ children, variant = "primary", className = "", ...props }: PixelButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 border-2 
        ${
          variant === "primary"
            ? "border-[#0f380f] dark:border-[#9bbc0f] bg-[#306850] dark:bg-[#8bac0f] text-[#9bbc0f] dark:text-[#0f380f]"
            : "border-[#306850] dark:border-[#8bac0f] bg-transparent text-[#306850] dark:text-[#8bac0f]"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:brightness-110 active:brightness-90
        transition-all pixel-text
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

