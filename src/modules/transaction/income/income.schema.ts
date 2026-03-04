import { z } from 'zod'
import { paginationSchema } from '../../../shared/module/schema'

export const getIncomeSchema = paginationSchema.extend({
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  statusId: z.string().optional(),
  date: z.string().optional(),
})

export const createIncomeSchema = z.object({
  merchantName: z.string(),
  description: z.string().optional(),
  amount: z.string(),
  date: z.string(),
  categoryId: z.string(),
})

export const updateStatusIncomeSchema = z.object({
  statusId: z.string(),
})

export type GetIncomeInput = z.infer<typeof getIncomeSchema>
export type CreateIncomeInput = z.infer<typeof createIncomeSchema>
export type UpdateStatusIncomeInput = z.infer<typeof updateStatusIncomeSchema>