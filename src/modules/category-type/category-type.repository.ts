import { and, count, ilike, inArray, isNull } from "drizzle-orm";
import { db } from "../../shared/database";
import { GetCategoryTypeInput } from "./category-type.schema";
import { categoryType } from "../../shared/database/schema";

export const categoryTypeRepository = {
  findByIds(ids: number[]) {
    return db.query.categoryType.findMany({
      where: and(
        inArray(categoryType.id, ids),
        isNull(categoryType.deletedAt)
      ),
      columns: { id: true }
    })
  },
  find(params: GetCategoryTypeInput) {
    return db.query.categoryType.findMany({
      where: and(
        params.search ? ilike(categoryType.name, `%${params.search}%`) : undefined,
        isNull(categoryType.deletedAt)
      ),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  },

  async count(search?: string) {
    const result = await db
      .select({ value: count() })
      .from(categoryType)
      .where(and(
        search ? ilike(categoryType.name, `%${search}%`) : undefined,
        isNull(categoryType.deletedAt)
      ))

    return result[0].value
  }
}