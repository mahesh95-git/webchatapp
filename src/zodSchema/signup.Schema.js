import { z } from "zod";
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data)=>data.password === data.confirmPassword,{
    message:"Password and confirm password do not match",
    path:["confirmPassword"]
});
export default signupSchema;
