import { z } from "zod";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email").regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default loginSchema;
