import {z} from 'zod';

export const usernameValidation = z
 .string()
 .min(6, { message: "username must be at least 6 characters long" })
 .max(20, { message: "username must be at most 20 characters long" })
 .regex(/^[a-zA-Z0-9]+$/, { message: "username can only contain letters and numbers" })



export const signupSchema = z.object({
    username: usernameValidation,
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(20, { message: "Password must be at most 20 characters long" }),
    email: z.string().email({ message: "Invalid email address" })
})


