import { and, count, eq, exists, ilike, isNull } from "drizzle-orm"
import { db } from "../../shared/database"
import { categories, categoryCategories } from "../../shared/database/schema"
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
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        },
        categoryTypes: {
          with: {
            categoryType: {
              columns: { id: true, name: true }
            }
          }
        }
      }
    })
  },

  async create(data: CreateCategoryInput, user: JwtPayload) {
    return db.transaction(async (tx) => {
      const [category] = await tx
        .insert(categories)
        .values({
          name: data.name,
          organizationId: user.organizationId,
        })
        .returning({ id: categories.id })

      await tx.insert(categoryCategories).values(
        data.type_ids.map((typeId) => ({
          categoryId: category.id,
          typeId,
        }))
      )

      return category
    })
  },

  async update(id: string, data: UpdateCategoryInput) {
    return db.transaction(async (tx) => {
      const [category] = await tx
        .update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning({ id: categories.id })

      await tx.delete(categoryCategories).where(eq(categoryCategories.categoryId, id))

      await tx.insert(categoryCategories).values(
        data.type_ids.map((typeId) => ({
          categoryId: id,
          typeId,
        }))
      )

      return category
    })
  },

  delete(id: string) {
    return db.transaction(async (tx) => {
      await tx.update(categories).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(categories.id, id)).returning({ id: categories.id })
      await tx.delete(categoryCategories).where(eq(categoryCategories.categoryId, id))

      return { id }
    })
  },

  find(params: GetCategoryInput, user: JwtPayload) {
    return db.query.categories.findMany({
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      where: and(
        eq(categories.organizationId, user.organizationId),
        params.type_ids
          ? exists(
            db.select().from(categoryCategories).where(
              and(
                eq(categoryCategories.categoryId, categories.id),
                eq(categoryCategories.typeId, params.type_ids[0])
              )
            )
          )
          : undefined,
        params.search ? ilike(categories.name, `%${params.search}%`) : undefined,
        isNull(categories.deletedAt),
      ),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        },
        categoryTypes: {
          with: {
            categoryType: {
              columns: { id: true, name: true }
            }
          }
        }
      }
    })
  },

  async count(params: GetCategoryInput, user: JwtPayload) {
    const result = await db
      .select({ value: count() })
      .from(categories)
      .where(and(
        eq(categories.organizationId, user.organizationId),
        params.type_ids
          ? exists(
            db.select().from(categoryCategories).where(
              and(
                eq(categoryCategories.categoryId, categories.id),
                eq(categoryCategories.typeId, params.type_ids[0])
              )
            )
          )
          : undefined,
        params.search ? ilike(categories.name, `%${params.search}%`) : undefined,
        isNull(categories.deletedAt),
      ))

    return result[0].value
  }
}