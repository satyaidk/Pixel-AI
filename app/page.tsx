"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { generateAIResponse, checkApiKey } from "./actions"
import PixelContainer from "@/components/pixel-container"
import PixelHeader from "@/components/pixel-header"
import PixelInput from "@/components/pixel-input"
import PixelMessage from "@/components/pixel-message"
import PixelButton from "@/components/pixel-button"
import PixelLoading from "@/components/pixel-loading"
import PixelModelSelector from "@/components/pixel-model-selector"

// Define message type
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [model, setModel] = useState("gpt-4o-mini") // Set default to gpt-4o-mini
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<{ configured: boolean; message: string } | null>(null)

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check API key on load
  useEffect(() => {
    const checkKey = async () => {
      try {
        const result = await checkApiKey()
        if (result.configured) {
          setApiKeyStatus({
            configured: true,
            message: `API key configured (${result.keyPrefix}...)`,
          })
        } else {
          setApiKeyStatus({
            configured: false,
            message: "API key not configured. Please add it to your .env.local file.",
          })
          setError("OpenAI API key is not configured. Please add it to your .env.local file.")
        }
      } catch (err) {
        console.error("Failed to check API key:", err)
        setApiKeyStatus({
          configured: false,
          message: "Failed to check API key status.",
        })
      }
    }

    checkKey()
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, []) // Updated dependency

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Clear previous errors
    setError(null)

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Format messages for OpenAI (without the id field)
      const formattedMessages = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }))

      // Call server action
      const result = await generateAIResponse(formattedMessages, model)

      if (!result.success) {
        // If there's a fallback suggestion, try with the fallback model
        if (result.fallback) {
          setModel("gpt-3.5-turbo")
          const fallbackResult = await generateAIResponse(formattedMessages, "gpt-3.5-turbo")

          if (!fallbackResult.success) {
            throw new Error(fallbackResult.error || "Failed to generate response with fallback model")
          }

          // Add assistant message from fallback
          const assistantMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: fallbackResult.content,
          }

          setMessages((prev) => [...prev, assistantMessage])
          return
        }

        throw new Error(result.error || "Failed to generate response")
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: result.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      console.error("Error sending message:", err)
      setError(err.message || "Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={`min-h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-1 flex flex-col bg-[#8bac0f] dark:bg-[#0f380f] transition-colors duration-300">
        <PixelHeader onThemeToggle={toggleTheme} theme={theme} />

        <PixelContainer>
          <div className="p-4 border-b-4 border-[#306850] dark:border-[#8bac0f]">
            <PixelModelSelector onModelChange={setModel} currentModel={model} />

            {/* API Key Status */}
            {apiKeyStatus && (
              <div
                className={`mt-2 text-xs pixel-text ${apiKeyStatus.configured ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {apiKeyStatus.message}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="pixel-art mb-4 w-16 h-16 bg-[#306850] dark:bg-[#8bac0f]"></div>
                <p className="pixel-text text-[#306850] dark:text-[#8bac0f]">WELL COME TO PIXEL AI</p>
                <p className="pixel-text text-[#306850] dark:text-[#8bac0f] text-sm mt-2">❤️</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <PixelMessage key={message.id} role={message.role} content={message.content} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
            {isLoading && <PixelLoading />}
            {error && (
              <div className="border-2 border-red-500 dark:border-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <p className="pixel-text text-red-600 dark:text-red-400 text-center text-sm">{error}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t-4 border-[#306850] dark:border-[#8bac0f] p-4">
            <div className="flex gap-2">
              <PixelInput
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading || !apiKeyStatus?.configured}
              />
              <PixelButton type="submit" disabled={isLoading || !input.trim() || !apiKeyStatus?.configured}>
                {isLoading ? "..." : "SEND"}
              </PixelButton>
            </div>
          </form>
        </PixelContainer>
      </div>
    </main>
  )
}

