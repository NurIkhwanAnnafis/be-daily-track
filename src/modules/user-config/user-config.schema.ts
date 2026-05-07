import { z } from "zod";

export const getConfigByUserIdSchema = z.object({
  userId: z.uuid()
})

export const createConfigSchema = z.object({
  initial_amount: z.number().default(0),
  expense_limit_per_day: z.number().default(0),
  expense_limit_per_month: z.number().default(0),
  income_limit_per_day: z.number().default(0),
  income_limit_per_month: z.number().default(0)
})

export type GetConfigByUserIdInput = z.infer<typeof getConfigByUserIdSchema>
export type CreateConfigInput = z.infer<typeof createConfigSchema>
export type UpdateConfigInput = Partial<CreateConfigInput>