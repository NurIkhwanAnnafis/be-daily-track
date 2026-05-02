import { AppError } from "../../shared/errors/app-error"
import { keysToSnakeCase } from "../../shared/utils/object"
import { userConfigRepository } from "./user-config.repository"
import { CreateConfigInput, UpdateConfigInput } from "./user-config.schema"

export const userConfigService = {
  async create(userId: string, input: CreateConfigInput) {
    const result = await userConfigRepository.create(userId, input)

    return keysToSnakeCase(result)
  },

  async update(userId: string, input: UpdateConfigInput) {
    const existingConfig = await userConfigRepository.findByUserId(userId)
    if (!existingConfig) {
      throw new AppError('User config not found', 404)
    }

    const result = await userConfigRepository.update(userId, input)

    return keysToSnakeCase(result)
  },

  async getByUserId(userId: string) {
    const existingConfig = await userConfigRepository.findByUserId(userId)
    if (!existingConfig) {
      throw new AppError('User config not found', 404)
    }

    const { userId: _, ...rest } = existingConfig

    return keysToSnakeCase(rest)
  }
}