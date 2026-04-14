import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const getTransactionSchema = paginationSchema.extend({
  categoryId: z.string().optional(),
  typeId: z.number().optional(),
  statusId: z.number().optional(),
  date: z.string().optional(),
})

export const createTransactionSchema = z.object({
  merchant_name: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  date: z.string(),
  category_id: z.string(),
})

export const updateTransactionSchema = z.object({
  merchant_name: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  date: z.string(),
  category_id: z.string(),
})

export const updateStatusTransactionSchema = z.object({
  id: z.string(),
  status_id: z.number(),
})

export const deleteTransactionSchema = z.object({
  id: z.string(),
})

export const getTransactionIdSchema = z.object({
  id: z.uuid()
})

export type GetTransactionInput = z.infer<typeof getTransactionSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type UpdateStatusTransactionInput = z.infer<typeof updateStatusTransactionSchema>
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>
export type GetTransactionIdInput = z.infer<typeof getTransactionIdSchema>