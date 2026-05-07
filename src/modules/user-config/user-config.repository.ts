import { db } from "../../shared/database"
import { usersConfig } from "../../shared/database/schema"
import { eq } from "drizzle-orm"
import { CreateConfigInput, UpdateConfigInput } from "./user-config.schema"
import { UserConfig } from "./user-config.type"

export const userConfigRepository = {
  async create(userId: string, input: CreateConfigInput) {
    const [result] = await db.insert(usersConfig)
    .values({
      userId: userId,
      config: {
        ...input,
        currentAmount: input.initial_amount,
      },
      createdAt: new Date(),
      updatedAt: null,
    })
    .returning()

    return result
  },

  async update(userId: string, input: UpdateConfigInput, existingConfig: UserConfig) {
    const [result] = await db.update(usersConfig)
    .set({
      config: {
        ...existingConfig,
        ...input,
      },
      updatedAt: new Date(),
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