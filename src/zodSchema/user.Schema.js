import {z} from 'zod'
const userSchema = z.object({
    username: z.string(),
    email: z.string().email("Please enter a valid email"),
    about:z.string().max(100,"About must be at most 100 characters"),
})
export default userSchema