import z from "zod";
import { paginationSchema } from "../../shared/module/schema";

export const getCategoryTypeSchema = paginationSchema
export const getAllCategoryTypeSchema = z.object({
  search: z.string().optional(),
})

export type GetCategoryTypeInput = z.infer<typeof getCategoryTypeSchema>
export type GetAllCategoryTypeInput = z.infer<typeof getAllCategoryTypeSchema>