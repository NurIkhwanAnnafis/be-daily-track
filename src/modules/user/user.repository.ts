import { count, eq, ilike } from "drizzle-orm"
import { db } from "../../shared/database"
import { users } from "../../shared/database/schema"
import { CreateUserInput, GetUsersInput } from "./user.schema"

export type CreateUserDbInput = Omit<CreateUserInput, 'password'> & { passwordHash: string }

export const userRepository = {
  findByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) })
  },

  create(input: CreateUserDbInput) {
    return db.insert(users).values({
      email: input.email,
      organizationId: input.organization_id,
      passwordHash: input.passwordHash
    }).returning()
  },

  findById(id: string) {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  },

  find(params: GetUsersInput) {
    return db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // organizationId excluded — represented by the nested `organization` object below
        // passwordHash excluded — sensitive
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        }
      },
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      where: params.search ? ilike(users.email, `%${params.search}%`) : undefined
    })
  },

  async count(search?: string) {
    const result = await db
      .select({ value: count() })
      .from(users)
      .where(search ? ilike(users.email, `%${search}%`) : undefined)
    return result[0].value
  },
}