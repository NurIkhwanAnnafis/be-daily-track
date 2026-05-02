import { z } from "zod";

export const getConfigByUserIdSchema = z.object({
  userId: z.uuid()
})

export const createConfigSchema = z.object({
  initialAmount: z.number().default(0),
  expenseLimitPerDay: z.number().default(0),
  expenseLimitPerMonth: z.number().default(0),
  incomeLimitPerDay: z.number().default(0),
  incomeLimitPerMonth: z.number().default(0)
})

export type GetConfigByUserIdInput = z.infer<typeof getConfigByUserIdSchema>
export type CreateConfigInput = z.infer<typeof createConfigSchema>
export type UpdateConfigInput = Partial<CreateConfigInput>