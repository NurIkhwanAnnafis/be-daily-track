import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const refreshSchema = z.object({
  refresh_token: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
