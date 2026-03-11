import z from "zod";
import { paginationSchema } from "../../shared/module/schema";

export const getCategoryTypeSchema = paginationSchema

export type GetCategoryTypeInput = z.infer<typeof getCategoryTypeSchema>