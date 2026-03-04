import { count, eq, ilike } from "drizzle-orm"
import { db } from "../../shared/database"
import { categories } from "../../shared/database/schema"
import { CreateCategoryInput, GetCategoryInput, UpdateCategoryInput } from "./category.schema"

export const categoryRepository = {
  findByName(name: string) {
    return db.query.categories.findFirst({ where: eq(categories.name, name) })
  },

  findById(id: string) {
    return db.query.categories.findFirst({ where: eq(categories.id, id) })
  },

  create(data: CreateCategoryInput) {
    return db.insert(categories).values({
      name: data.name,
      organizationId: data.organization_id,
      typeId: data.type_id,
    }).returning()
  },

  update(id: string, data: UpdateCategoryInput) {
    return db.update(categories).set({ ...data, updatedAt: new Date() }).where(eq(categories.id, id)).returning()
  },

  delete(id: string) {
    return db.delete(categories).where(eq(categories.id, id)).returning()
  },

  find(params: GetCategoryInput) {
    return db.query.categories.findMany({
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      where: params.type_id ? eq(categories.typeId, params.type_id) : undefined
    })
  },

  async count(search?: string) {
    const result = await db
      .select({ value: count() })
      .from(categories)
      .where(search ? ilike(categories.name, `%${search}%`) : undefined)

    return result[0].value
  }
}