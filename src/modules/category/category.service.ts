import { AppError } from "../../shared/errors/app-error"
import { JwtPayload } from "../../shared/utils/jwt"
import { categoryRepository } from "./category.repository"
import { CreateCategoryInput, GetCategoryInput, UpdateCategoryInput } from "./category.schema"

export const categoryService = {
  async getCategories(params: GetCategoryInput, user: JwtPayload) {
    const [categories, total] = await Promise.all([
      categoryRepository.find(params, user),
      categoryRepository.count(user, params.search)
    ])
    return { data: categories, meta: { total, page: params.page, limit: params.limit } }
  },

  async createCategory(data: CreateCategoryInput, user: JwtPayload) {
    const existCategory = await categoryRepository.findByName(data.name)
    if (existCategory) {
      throw new AppError('Category already exists', 400)
    }

    const category = await categoryRepository.create(data, user)
    return category
  },

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('Category not found', 404)
    }

    return category
  },

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('Category not found', 404)
    }

    const updatedCategory = await categoryRepository.update(id, data)
    return updatedCategory
  },

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('Category not found', 404)
    }

    const deletedCategory = await categoryRepository.delete(id)
    return deletedCategory
  }
}