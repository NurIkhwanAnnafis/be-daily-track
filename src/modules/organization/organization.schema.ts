import { z } from 'zod'
import { paginationSchema } from '../../shared/module/schema'

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(255),
})

export const getOrganizationsSchema = paginationSchema

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type GetOrganizationsInput = z.infer<typeof getOrganizationsSchema>
