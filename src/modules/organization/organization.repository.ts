import { eq } from 'drizzle-orm'
import { db } from '../../shared/database'
import { organizations } from '../../shared/database/schema'
import { CreateOrganizationInput } from './organization.schema'

export const organizationRepository = {
  findById(id: string) {
    return db.query.organizations.findFirst({ where: eq(organizations.id, id) })
  },

  create(input: CreateOrganizationInput) {
    return db.insert(organizations).values(input).returning()
  },
}
