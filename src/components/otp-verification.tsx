"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface OtpVerificationProps {
  username: string
}

export function OtpVerification({ username }: OtpVerificationProps) {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onVerify = async ()=>{
    setIsVerifying(true)
    try {
      console.log(Number(otp.join('')));
      
      const response = await axios.post<ApiResponse>("/api/verify-code",{username ,code:  Number(otp.join(''))} )

      if(response.data.success){
        toast.success(response.data.message)
        router.replace("/login")
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
       console.error("Error signing up:", error)
       const axiosError = error as AxiosError<ApiResponse>
       let errorMessage = axiosError.response?.data.message || "An error occurred with the signup process"
       toast.error(errorMessage)
    }finally{
      setIsVerifying(false)
    }
  }

  const handleResendOtp = () => {
    // In a real app, you would call an API to resend the OTP
    setTimer(60)
    setCanResend(false)
  }

  return (
    <div className="w-full max-w-md bg-slate-800/80 border border-purple-500/30 backdrop-blur-sm rounded-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Verify your email</h2>
        <p className="text-slate-400 mt-1">
          We've sent a verification code to <span className="text-white">{username}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el: any) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-lg bg-slate-700 border-slate-600 text-white p-0"
            />
          ))}
        </div>
        <Button
          onClick={onVerify}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          disabled={otp.some((digit) => !digit)}
        >
          {isVerifying ? "Verifying...." :"Verify"}
          
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-slate-400">
          Didn't receive a code?{" "}
          {canResend ? (
            <button onClick={handleResendOtp} className="text-purple-400 hover:underline">
              Resend code
            </button>
          ) : (
            <span className="text-slate-500">Resend in {timer}s</span>
          )}
        </p>
      </div>
    </div>
  )
}
