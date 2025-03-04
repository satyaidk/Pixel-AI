import type { ReactNode } from "react"

interface PixelContainerProps {
  children: ReactNode
}

export default function PixelContainer({ children }: PixelContainerProps) {
  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full my-4 border-4 border-[#306850] dark:border-[#8bac0f] bg-[#9bbc0f] dark:bg-[#306850] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  )
}

