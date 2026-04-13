import { AppError } from "../../shared/errors/app-error"
import { JwtPayload } from "../../shared/utils/jwt"
import { keysToSnakeCase } from "../../shared/utils/object"
import { categoryTypeRepository } from "../category-type/category-type.repository"
import { categoryRepository } from "./category.repository"
import { CreateCategoryInput, GetCategoryInput, UpdateCategoryInput } from "./category.schema"
import { formatCategory } from "./category.util"

export const categoryService = {
  async getCategories(params: GetCategoryInput, user: JwtPayload) {
    const [categories, total] = await Promise.all([
      categoryRepository.find(params, user),
      categoryRepository.count(params, user)
    ])

    const data = categories.map(category => formatCategory(category))
    return { data, meta: { total, page: params.page, limit: params.limit } }
  },

  async createCategory(data: CreateCategoryInput, user: JwtPayload) {
    const existCategory = await categoryRepository.findByName(data.name)
    if (existCategory) {
      throw new AppError('Category already exists', 400)
    }

    const foundTypes = await categoryTypeRepository.findByIds(data.type_ids)
    const foundIds = foundTypes.map(t => t.id)
    const invalidIds = data.type_ids.filter(id => !foundIds.includes(id))
    if (invalidIds.length > 0) {
      throw new AppError(`Category type not found: ${invalidIds.join(', ')}`, 400)
    }

    const category = await categoryRepository.create(data, user)
    return keysToSnakeCase(category)
  },

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('Category not found', 404)
    }

    return keysToSnakeCase(category)
  },

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await categoryRepository.findById(id)
    if (!category) {
      throw new AppError('Category not found', 404)
    }

    const existCategory = await categoryRepository.findByName(data.name)
    if (existCategory && existCategory.id !== id) {
      throw new AppError('Category name already exists', 400)
    }

    const foundTypes = await categoryTypeRepository.findByIds(data.type_ids)
    const foundIds = foundTypes.map(t => t.id)
    const invalidIds = data.type_ids.filter(id => !foundIds.includes(id))
    if (invalidIds.length > 0) {
      throw new AppError(`Category type not found: ${invalidIds.join(', ')}`, 400)
    }

    const updatedCategory = await categoryRepository.update(id, data)
    return keysToSnakeCase(updatedCategory)
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