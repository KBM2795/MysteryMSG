"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ArrowLeft, Send, Sparkles } from "lucide-react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { boolean } from "zod"

interface MessagePageProps {
  params: Promise<{
    username: string
  }>
}

export default function MessagePage({ params }: MessagePageProps) {

  const { username } = use(params)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", { username, content: message })

      if (!response.data.success) {
        toast.error(response.data.message)
        setIsSending(false)
      } else {
        setIsSending(false)
        setIsSent(true)
        setMessage("")
      }

    } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with handleSendMessage"
      toast.error(errorMessage)
    } finally {
      setIsSending(false)
      setTimeout(() => {
        setIsSent(false)
      }, 5000)
    }

  }

  const handleSuggestions = async () => {
    try {
      const response = await axios.get("/api/suggest-messages")

      if (!response.data.success) {
        toast.error("error fetching suggestions")
      } else {
        const suggestionsArray = response.data.questions.split("||").map((item: string) => item.trim())
        setSuggestions(suggestionsArray)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with handleSuggestions"
      toast.error(errorMessage)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900 flex flex-col">
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-purple-400">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white">MysteryMSG</h1>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-5 mb-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Send Anonymous Message to @{username}</h2>
          <p className="text-slate-300">Your identity will remain anonymous. Be kind and respectful!</p>
        </div>

        {isSent ? (
          <div className="bg-green-900/20 border border-green-500/30 backdrop-blur-sm rounded-xl p-5 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
            <p className="text-slate-300">Your anonymous message has been delivered to @{username}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder={`Write your anonymous message to @${username}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 bg-slate-800/80 border-purple-500/30 text-white resize-none"
              />
              <Button
                onClick={() => handleSuggestions()}
                variant="ghost"
                size="icon"
                className="absolute bottom-3 left-3 text-slate-400 hover:text-purple-400 hover:bg-slate-700"
                title="Get AI suggestions"
              >
                <Sparkles className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!message.trim() || isSending}
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>

            {showSuggestions && (
              <div className="bg-slate-800/80 border border-purple-500/30 rounded-xl p-4 mt-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Message Suggestions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-2 px-4 text-left border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <section className="bg-gradient-to-r from-purple-900/80 to-slate-800/80 border-y border-purple-500/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6"></div>
          <h2 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            Create Your Mystery Profile
          </h2>
          <p className="text-lg text-slate-300 mb-6">
            Join thousands of users receiving anonymous messages. Share your thoughts, spread positivity, and connect with others in a unique way!
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-6 text-lg transform transition-transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              Get Started Now ✨
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-purple-500/20 py-4">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} MysteryMSG. All messages are anonymous.</p>
        </div>
      </footer>
    </div>
  )
}
