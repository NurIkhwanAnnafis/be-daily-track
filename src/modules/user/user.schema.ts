import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  organization_id: z.uuid()
})

export const getUserByIdSchema = z.object({
  id: z.uuid()
})

export const getUsersSchema = paginationSchema

export type CreateUserInput = z.infer<typeof createUserSchema>
export type GetUsersInput = z.infer<typeof getUsersSchema>
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>
