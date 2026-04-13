import { keysToSnakeCase } from "../../shared/utils/object"
import { categoryTypeRepository } from "./category-type.repository"
import { GetAllCategoryTypeInput, GetCategoryTypeInput } from "./category-type.schema"

export const categoryTypeService = {
  async getCategoryTypes(params: GetCategoryTypeInput) {
    const [categoryTypes, total] = await Promise.all([
      categoryTypeRepository.find(params),
      categoryTypeRepository.count(params.search)
    ])

    const data = categoryTypes.map(categoryType => keysToSnakeCase(categoryType))
    return { data, meta: { total, page: params.page, limit: params.limit } }
  },

  async getAllCategoryTypes(params: GetAllCategoryTypeInput) {
    const [categoryTypes, total] = await Promise.all([
      categoryTypeRepository.findAll(params),
      categoryTypeRepository.count(params.search)
    ])

    const data = categoryTypes.map(categoryType => keysToSnakeCase(categoryType))
    return { data, meta: { total, page: 1, limit: 0 } }
  }
}