import {z} from 'zod';

export const usernameNalidation = z
 .string()
 .min(6, { message: "Verification code must be at least 6 characters long" })
 .max(20, { message: "Verification code must be at most 20 characters long" })
 .regex(/^[a-zA-Z0-9]+$/, { message: "Verification code can only contain letters and numbers" })



export const signupSchema = z.object({
    username: usernameNalidation,
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(20, { message: "Password must be at most 20 characters long" }),
    email: z.string().email({ message: "Invalid email address" })
})


