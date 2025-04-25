"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ArrowLeft, Send, Sparkles } from "lucide-react"

interface MessagePageProps {
  params: {
    username: string
  }
}

export default function MessagePage({ params }: MessagePageProps) {
  const { username } = params
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsSending(true)

    // In a real app, you would call an API to send the message
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
      setMessage("")

      // Reset the sent state after a few seconds
      setTimeout(() => {
        setIsSent(false)
      }, 5000)
    }, 1500)
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
                onClick={() => setShowSuggestions(!showSuggestions)}
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
                  {[
                    "What's your favorite movie?",
                    "If you could travel anywhere, where would you go?",
                    "What's something you're proud of that you accomplished recently?",
                    "What's a skill you've always wanted to learn?",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-2 px-4 text-left border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
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

      <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-purple-500/20 py-4">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} MysteryMSG. All messages are anonymous.</p>
        </div>
      </footer>
    </div>
  )
}
