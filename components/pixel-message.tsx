interface PixelMessageProps {
  role: "user" | "assistant" | "system"
  content: string
}

export default function PixelMessage({ role, content }: PixelMessageProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%] p-3 border-2 
          ${
            role === "user"
              ? "border-[#0f380f] dark:border-[#9bbc0f] bg-[#c4cfa1] dark:bg-[#4a6938]"
              : "border-[#306850] dark:border-[#8bac0f] bg-[#e0f8d0] dark:bg-[#1f1f1f]"
          }
          ${role === "user" ? "rounded-tl-lg rounded-bl-lg rounded-tr-lg" : "rounded-tr-lg rounded-br-lg rounded-tl-lg"}
        `}
      >
        <p
          className={`
          whitespace-pre-wrap break-words pixel-text text-sm
          ${role === "user" ? "text-[#0f380f] dark:text-[#9bbc0f]" : "text-[#306850] dark:text-[#8bac0f]"}
        `}
        >
          {content}
        </p>
      </div>
    </div>
  )
}

