import { AppError } from "../../shared/errors/app-error"
import { keysToSnakeCase } from "../../shared/utils/object"
import { userConfigRepository } from "./user-config.repository"
import { CreateConfigInput, UpdateConfigInput } from "./user-config.schema"
import { UserConfig } from "./user-config.type"

export const userConfigService = {
  async create(userId: string, input: CreateConfigInput) {
    const existingConfig = await userConfigRepository.findByUserId(userId)
    if (existingConfig) {
      throw new AppError('User config already exists', 400)
    }

    const result = await userConfigRepository.create(userId, input)

    return keysToSnakeCase(result)
  },

  async update(userId: string, input: UpdateConfigInput) {
    const existingConfig = await userConfigRepository.findByUserId(userId)
    if (!existingConfig) {
      throw new AppError('User config not found', 404)
    }

    const result = await userConfigRepository.update(userId, input, existingConfig.config as UserConfig)

    return keysToSnakeCase(result)
  },

  async getByUserId(userId: string) {
    const existingConfig = await userConfigRepository.findByUserId(userId)
    if (!existingConfig) {
      throw new AppError('User config not found', 404)
    }

    const { userId: _, ...rest } = existingConfig

    return {
      ...keysToSnakeCase(rest),
    }
  }
}