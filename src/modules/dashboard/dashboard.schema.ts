import z from "zod";

export const getDashboardTransactionSchema = z.object({
  date: z.string().min(1)
})

export type GetDashboardTransactionSchemaInput = z.infer<typeof getDashboardTransactionSchema>