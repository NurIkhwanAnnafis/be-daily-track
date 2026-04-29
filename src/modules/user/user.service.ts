import bcrypt from 'bcrypt'
import { CreateUserInput, GetUsersInput } from './user.schema'
import { userRepository } from './user.repository'
import { SafeUser } from './user.types'
import { AppError } from '../../shared/errors/app-error'
import { keysToSnakeCase } from '../../shared/utils/object'

export const userService = {
  async createUser(input: CreateUserInput): Promise<SafeUser> {
    const { email, password } = input
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw new AppError('User already exists', 409)
    }
    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await userRepository.create({
      email,
      organization_id: input.organization_id,
      passwordHash: hashedPassword
    })

    const { passwordHash: _, ...safeUser } = result[0]
    return safeUser
  },

  async getUsers(params: GetUsersInput) {
    const [result, total] = await Promise.all([
      userRepository.find(params),
      userRepository.count(params.search),
    ])

    const meta = {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    }

    return { data: result, meta }
  },

  async getUserById(id: string) {
    const result = await userRepository.findById(id)
    if (!result) {
      throw new AppError('User not found', 404)
    }

    return keysToSnakeCase(result)
  }
}
