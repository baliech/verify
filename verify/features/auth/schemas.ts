import {z} from "zod";



export const LoginSchema = z.object({
    email: z.string().email(),
    password:z.string().min(1,"Required"),
  } )



export const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Password must contain at least one lowercase letter"
    )
    .refine(
      (password) => /[0-9]/.test(password),
      "Password must contain at least one number"
    )
    .refine(
      (password) => /[^A-Za-z0-9]/.test(password),
      "Password must contain at least one special character"
    )
})
