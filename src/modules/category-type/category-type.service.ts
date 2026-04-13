import { keysToSnakeCase } from "../../shared/utils/object"
import { categoryTypeRepository } from "./category-type.repository"
import { GetCategoryTypeInput } from "./category-type.schema"

export const categoryTypeService = {
  async getCategoryTypes(params: GetCategoryTypeInput) {
    const [categoryTypes, total] = await Promise.all([
      categoryTypeRepository.find(params),
      categoryTypeRepository.count(params.search)
    ])

    const data = categoryTypes.map(categoryType => keysToSnakeCase(categoryType))
    return { data, meta: { total, page: params.page, limit: params.limit } }
  }
}