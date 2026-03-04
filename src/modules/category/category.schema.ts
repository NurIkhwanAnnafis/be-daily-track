import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const createCategorySchema = z.object({
  name: z.string().min(1),
  organization_id: z.uuid(),
  type_id: z.uuid()
})

export const updateCategorySchema = z.object({
  name: z.string().min(1),
})

export const getCategorySchema = paginationSchema.extend({
  type_id: z.uuid().optional()
})

export const getCategoryIdSchema = z.object({
  id: z.uuid()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type GetCategoryInput = z.infer<typeof getCategorySchema>
export type GetCategoryIdInput = z.infer<typeof getCategoryIdSchema>