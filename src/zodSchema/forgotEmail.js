import {z} from "zod"

const forgotEmailSchema = z.object({
    email:z.string().email("Please enter a valid email"),
})

const forgotPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),

}).refine((data)=>data.newPassword === data.confirmPassword,{
    message:"Password and confirm password do not match",
    path:["confirmPassword"]
})
export {forgotEmailSchema,forgotPasswordSchema} 