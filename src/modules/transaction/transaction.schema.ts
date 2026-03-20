import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const getTransactionSchema = paginationSchema.extend({
  categoryId: z.string().optional(),
  typeId: z.string().optional(),
  statusId: z.string().optional(),
  date: z.string().optional(),
})

export const createTransactionSchema = z.object({
  merchantName: z.string(),
  description: z.string().optional(),
  amount: z.string(),
  date: z.string(),
  categoryId: z.string(),
})

export const updateStatusTransactionSchema = z.object({
  id: z.string(),
  statusId: z.string(),
})

export const deleteTransactionSchema = z.object({
  id: z.string(),
})

export type GetTransactionInput = z.infer<typeof getTransactionSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateStatusTransactionInput = z.infer<typeof updateStatusTransactionSchema>
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>