"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Copy, MessageSquare, RefreshCw, Sparkles, LogOut, Router } from "lucide-react"
import { MessageItem } from "@/components/message-item"
import { useSession ,signOut } from "next-auth/react"
import { User } from "next-auth"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { boolean } from "zod"

// Sample data for demonstration


interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const [messages , setMessages] = useState<Message[]>([])
  const [copy , setcopy] = useState(false)
  const [acceptMessages, setAcceptMessages] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [userLink , setUserLink] = useState("")
  const [url] = useState("https://mystery-msg-git-main-koshik-mehtas-projects.vercel.app")


  const { data: session, status } = useSession()

  const user: User = session?.user
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
    
      if(response.status === 200 || 201 ){
        setMessages(response.data.messages as unknown as Message[])       
      }else{
        toast.error("Invalid message format received")
      }
     } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with handleRefresh"
      toast.error(errorMessage)
     }finally{
      setIsRefreshing(false)
     }

  }

  useEffect( () => {
    const setStaus = async ()=>{
      if (session?.user?.username) {
        setUserLink(`${url}/u/${user.username}`)    
        try {
          const response = await axios.get<ApiResponse>("/api/accept-messages")
          console.log(response.data.isAceptingMessages);
            setAcceptMessages(response.data.isAceptingMessages? true : false)  
          if(!response.data.success){
            toast.error("error fetching status of message")
          }
         } catch (error) {
          console.error("Error signing up:", error)
          const axiosError = error as AxiosError<ApiResponse>
          let errorMessage = axiosError.response?.data.message || "An error occurred with setStaus"
          toast.error(errorMessage)
         }
      }
    }

    handleRefresh();
    setStaus();

  }, [session])

  const acceptMessage =async (e:boolean) =>{
     try {
      const response = await axios.post<ApiResponse>("/api/accept-messages",{acceptMessages: e} )

      if(response.status === 200){
        setAcceptMessages(response.data.isAceptingMessages? true : false)
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
     } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with acceptMessage"
      toast.error(errorMessage)
     }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userLink)
    setcopy(true)
  }

  

  const handleDeleteMessage = async (_id: string) => {
    console.log(_id);
    
    try {
      const response = await axios.post<ApiResponse>(`/api/delete_message?id=${_id}` )

      if(response.status === 200){
        handleRefresh();
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
     } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with acceptMessage"
      toast.error(errorMessage)
     }
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
            <Button onClick={()=> signOut()} variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
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
              <Switch id="accept-messages" checked={acceptMessages} onCheckedChange={(e)=>acceptMessage(e)} />
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
                  <MessageItem key={message._id} message={message} onDelete={() => handleDeleteMessage(message._id)} />
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
