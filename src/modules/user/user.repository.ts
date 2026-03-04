import { and, count, eq, ilike, isNull } from "drizzle-orm"
import { db } from "../../shared/database"
import { users } from "../../shared/database/schema"
import { CreateUserInput, GetUsersInput } from "./user.schema"

export type CreateUserDbInput = Omit<CreateUserInput, 'password'> & { passwordHash: string }

export const userRepository = {
  findByEmail(email: string) {
    return db.query.users.findFirst({
      where: and(
        eq(users.email, email),
        isNull(users.deletedAt)
      )
    })
  },

  create(input: CreateUserDbInput) {
    return db.insert(users).values({
      email: input.email,
      organizationId: input.organization_id,
      passwordHash: input.passwordHash
    }).returning()
  },

  update(id: string, data: CreateUserDbInput) {
    return db.update(users).set({
      ...data, updatedAt: new Date()
    }).where(eq(users.id, id)).returning({ id: users.id })
  },

  delete(id: string) {
    return db.update(users).set({
      deletedAt: new Date(), updatedAt: new Date()
    }).where(eq(users.id, id)).returning({ id: users.id })
  },

  findById(id: string) {
    return db.query.users.findFirst({
      where: and(
        eq(users.id, id),
        isNull(users.deletedAt)
      ),
      columns: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })
  },

  find(params: GetUsersInput) {
    return db.query.users.findMany({
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      where: and(
        params.search ? ilike(users.email, `%${params.search}%`) : undefined,
        isNull(users.deletedAt)
      ),
      columns: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        }
      },
    })
  },

  async count(search?: string) {
    const result = await db
      .select({ value: count() })
      .from(users)
      .where(and(
        search ? ilike(users.email, `%${search}%`) : undefined,
        isNull(users.deletedAt)
      ))
    return result[0].value
  },
}