import bcrypt from 'bcrypt'
import { CreateUserInput, GetUsersInput, UpdateUserInput } from './user.schema'
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
      password_hash: hashedPassword
    })

    const { passwordHash: _, ...safeUser } = result[0]
    return keysToSnakeCase(safeUser)
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<{ id: string }> {
    const {
      email,
      password,
      confirm_password
    } = input

    const existingUser = await userRepository.findById(id)
    if (!existingUser) {
      throw new AppError('User not found', 404)
    }

    const existingEmail = await userRepository.findByEmail(email)
    if (existingEmail && existingUser.id !== id) {
      throw new AppError('Email already used', 400)
    }

    if (password !== confirm_password) {
      throw new AppError('Password does not match', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await userRepository.update(id, {
      email,
      first_name: input.first_name,
      last_name: input.last_name,
      password_hash: hashedPassword
    })

    return result[0]
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

    return { data: result.map((user) => keysToSnakeCase(user)), meta }
  },

  async getUserById(id: string) {
    const result = await userRepository.findById(id)
    if (!result) {
      throw new AppError('User not found', 404)
    }

    return keysToSnakeCase(result)
  },

  async deleteUser(id: string) {
    const existingUser = await userRepository.findById(id)
    if (!existingUser) {
      throw new AppError('User not found', 404)
    }
    const result = await userRepository.delete(id)
    return result[0]
  }
}
