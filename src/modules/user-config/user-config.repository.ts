import { db } from "../../shared/database"
import { usersConfig } from "../../shared/database/schema"
import { eq } from "drizzle-orm"
import { CreateConfigInput, UpdateConfigInput } from "./user-config.schema"

export const userConfigRepository = {
  async create(userId: string, input: CreateConfigInput) {
    const [result] = await db.insert(usersConfig)
    .values({
      userId: userId,
      config: input
    })
    .returning()

    return result
  },

  async update(userId: string, input: UpdateConfigInput) {
    const [result] = await db.update(usersConfig)
    .set({
      config: input
    })
    .where(eq(usersConfig.userId, userId))
    .returning()

    return result
  },

  async findByUserId(userId: string) {
    const [result] = await db.select().from(usersConfig).where(eq(usersConfig.userId, userId))
    return result
  }
}