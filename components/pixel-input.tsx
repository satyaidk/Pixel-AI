import type { ChangeEvent } from "react"

interface PixelInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
}

export default function PixelInput({ value, onChange, placeholder, disabled }: PixelInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="flex-1 px-3 py-2 border-2 border-[#306850] dark:border-[#8bac0f] bg-[#e0f8d0] dark:bg-[#1f1f1f] text-[#0f380f] dark:text-[#9bbc0f] placeholder-[#306850]/50 dark:placeholder-[#8bac0f]/50 focus:outline-none focus:ring-2 focus:ring-[#0f380f] dark:focus:ring-[#9bbc0f] pixel-text"
    />
  )
}

