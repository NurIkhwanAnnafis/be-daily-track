import { and, count, eq, ilike, isNull } from 'drizzle-orm'
import { db } from '../../shared/database'
import { organizations } from '../../shared/database/schema'
import { CreateOrganizationInput, GetOrganizationsInput } from './organization.schema'

export const organizationRepository = {
  findById(id: string) {
    return db.query.organizations.findFirst({
      where: and(
        eq(organizations.id, id),
        isNull(organizations.deletedAt)
      )
    })
  },

  find(params: GetOrganizationsInput) {
    return db.query.organizations.findMany({
      where: and(
        params.search ? ilike(organizations.name, `%${params.search}%`) : undefined,
        isNull(organizations.deletedAt)
      ),
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (organizations, { desc }) => [desc(organizations.createdAt)],
    })
  },

  create(input: CreateOrganizationInput) {
    return db.insert(organizations).values(input).returning({ id: organizations.id })
  },

  update(id: string, data: CreateOrganizationInput) {
    return db.update(organizations).set({ ...data, updatedAt: new Date() }).where(eq(organizations.id, id)).returning({ id: organizations.id })
  },

  delete(id: string) {
    return db.update(organizations).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(organizations.id, id)).returning({ id: organizations.id })
  },

  async count(search?: string) {
    const result = await db
      .select({ value: count() })
      .from(organizations)
      .where(and(
        search ? ilike(organizations.name, `%${search}%`) : undefined,
        isNull(organizations.deletedAt)
      ))
    return result[0].value
  }
}
