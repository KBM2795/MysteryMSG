"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, MessageSquare, RefreshCw, Sparkles, LogOut } from "lucide-react"
import { MessageItem } from "@/components/message-item"
import { set } from "lodash"

// Sample data for demonstration
const messages = [
  {
    id: "1",
    content: "What's your favorite movie?",
    timestamp: "Apr 22, 2025 6:15 PM",
  },
  {
    id: "2",
    content: "I've always admired your creativity and positive attitude. You inspire me to be better!",
    timestamp: "Apr 21, 2025 2:06 AM",
  },
  {
    id: "3",
    content: "What's something you've always wanted to learn, but haven't had the chance to yet?",
    timestamp: "Apr 20, 2025 5:45 PM",
  },
  {
    id: "4",
    content: "Share a favorite childhood memory.",
    timestamp: "Apr 19, 2025 9:01 PM",
  },
]

export default function DashboardPage() {
  const [copy , setcopy] = useState(false)
  const [acceptMessages, setAcceptMessages] = useState(true)
  const [userLink] = useState("https://mysterymsg.com/u/username123")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userLink)
    setcopy(true)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // In a real app, you would fetch new messages
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleDeleteMessage = (id: string) => {
    // In a real app, you would delete the message
    console.log("Delete message", id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900">
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <h1 className="text-lg font-bold text-white">MysteryMSG</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Your Unique Link</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input value={userLink} readOnly className="bg-slate-700 border-slate-600 text-white" />
              </div>
              <Button onClick={handleCopyLink} className="bg-purple-500 hover:bg-purple-600 text-white">
                <Copy className="h-4 w-4 mr-2" />
                {copy ? "Copied" :"Copy"}
                
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Switch id="accept-messages" checked={acceptMessages} onCheckedChange={setAcceptMessages} />
              <Label htmlFor="accept-messages" className="text-white">
                Accept Messages: {acceptMessages ? "On" : "Off"}
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Messages</h2>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageItem key={message.id} message={message} onDelete={() => handleDeleteMessage(message.id)} />
                ))
              ) : (
                <div className="bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <p className="text-slate-400">No messages yet. Share your link to start receiving messages!</p>
                </div>
              )}
        </div>
      </main>
    </div>
  )
}
