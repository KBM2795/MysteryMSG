"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MessageItemProps {
  message: {
    _id: string
    content: string
    createdAt: string
  }
  onDelete: () => void
}

export function MessageItem({ message, onDelete }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-white mb-2">{message.content}</p>
      <p className="text-sm text-purple-400">{message.createdAt}</p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0 md:opacity-0"
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-800 border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600" onClick={onDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
