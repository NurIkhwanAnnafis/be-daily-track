import { and, count, eq, ilike, isNull } from "drizzle-orm"
import { db } from "../../shared/database"
import { categories } from "../../shared/database/schema"
import { CreateCategoryInput, GetCategoryInput, UpdateCategoryInput } from "./category.schema"
import { JwtPayload } from "../../shared/utils/jwt"

export const categoryRepository = {
  findByName(name: string) {
    return db.query.categories.findFirst({
      where: and(
        eq(categories.name, name),
        isNull(categories.deletedAt)
      )
    })
  },

  findById(id: string) {
    return db.query.categories.findFirst({
      where: and(
        eq(categories.id, id),
        isNull(categories.deletedAt)
      ),
      columns: {
        id: true,
        name: true,
        typeId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          }
        },
        organization: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })
  },

  create(data: CreateCategoryInput, user: JwtPayload) {
    return db.insert(categories).values({
      name: data.name,
      organizationId: user.organizationId,
      typeId: data.type_id,
    }).returning({ id: categories.id })
  },

  update(id: string, data: UpdateCategoryInput) {
    return db.update(categories).set({ ...data, updatedAt: new Date() }).where(eq(categories.id, id)).returning({ id: categories.id })
  },

  delete(id: string) {
    return db.update(categories).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(categories.id, id)).returning({ id: categories.id })
  },

  find(params: GetCategoryInput, user: JwtPayload) {
    return db.query.categories.findMany({
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      where: and(
        eq(categories.organizationId, user.organizationId),
        params.type_id ? eq(categories.typeId, params.type_id) : undefined,
        params.search ? ilike(categories.name, `%${params.search}%`) : undefined,
        isNull(categories.deletedAt),
      ),
      columns: {
        id: true,
        name: true,
        typeId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          }
        },
        organization: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })
  },

  async count(user: JwtPayload, search?: string) {
    const result = await db
      .select({ value: count() })
      .from(categories)
      .where(and(
        eq(categories.organizationId, user.organizationId),
        search ? ilike(categories.name, `%${search}%`) : undefined,
        isNull(categories.deletedAt)
      ))

    return result[0].value
  }
}