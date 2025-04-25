"use client"

import type React from "react"
import { useDebounceCallback } from "usehooks-ts"
import * as z from "zod"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { OtpVerification } from "@/components/otp-verification"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { signupSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced= useDebounceCallback(setUsername, 300)

  const [step, setStep] = useState<"signup" | "otp">("signup")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUserNameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {          
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "An error occurred")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUserNameUniqueness()
  }, [username])

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)

      if (response.status === 201) {
        setEmail(data.email) // Save email for OTP step
        setStep("otp")
        toast.success("Verification code sent to your email")
      } else {
        toast.error("Failed to send verification code")
      }
    } catch (error) {
      console.error("Error signing up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message || "An error occurred with the signup process"
      toast.error(errorMessage)
    } finally {
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

      {step === "signup" ? (
        <div className="w-full max-w-md bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create an account</h2>
            <p className="text-slate-400 mt-1">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                {...register("username", {
                  onChange: (e) => {
                    debounced(e.target.value);
                  }
                })}
                id="username"
                onChange={(e)=>{
                  setUsername(e.target.value)
                }}
                placeholder="Choose a unique username"
                className="bg-slate-700 border-slate-600 text-white"
              />
              {usernameMessage && (
                <p className={`text-sm ${usernameMessage.includes('Username is available') ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
              )}
              {isCheckingUsername && (
                <p className="text-yellow-500 text-sm">Checking username availability...</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-slate-700 border-slate-600 text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <p className="text-xs text-slate-400">We'll send you a verification code</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Create a secure password"
                className="bg-slate-700 border-slate-600 text-white"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-purple-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <OtpVerification username={username}  />
      )}
    </div>
  )
}

