"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { signInSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  const {
    register,
      handleSubmit,
    } = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: "",
        password: "",
      },
    })



  const handleLogin = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    console.log(data);
    
    try {
      const result = await signIn("credentials", {
          identifier: data.identifier,
          password: data.password,
          redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
          toast.error(result.error);
      } else {
          // Manually redirect after successful login
          router.replace("/dashboard"); // Or wherever you want to redirect
      }
  } catch (error) {
      toast.error("An error occurred during login");
  }finally{
    setIsSubmitting(false)
  }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-purple-400">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-purple-400" />
        <h1 className="text-xl font-bold text-white">MysteryMSG</h1>
      </div>

      <div className="w-full max-w-md bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-slate-400 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email/Username
            </Label>
            <Input
            {...register("identifier")}
              id="email"
              type="text"
              name="identifier"
              placeholder="Enter your email/username"
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
            {...register("password")}
              name="password"
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
            {!isSubmitting && (
              <span>Sign In</span>
              )}
            {isSubmitting && (
              <span>Sign In ......</span>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
