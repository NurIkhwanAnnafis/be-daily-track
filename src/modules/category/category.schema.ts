import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const createCategorySchema = z.object({
  name: z.string().min(1),
  type_ids: z.array(z.number()).min(1)
})

export const updateCategorySchema = z.object({
  name: z.string().min(1),
  type_ids: z.array(z.number()).min(1)
})

export const getCategorySchema = paginationSchema.extend({
  type_ids: z.preprocess(
    (val) => {
      if (val === undefined) return undefined
      if (Array.isArray(val)) return val
      if (typeof val === 'string') return val.split(',')
      return [val]
    },
    z.array(z.coerce.number()).optional()
  )
})

export const getCategoryIdSchema = z.object({
  id: z.uuid()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type GetCategoryInput = z.infer<typeof getCategorySchema>
export type GetCategoryIdInput = z.infer<typeof getCategoryIdSchema>