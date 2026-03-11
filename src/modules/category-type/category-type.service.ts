import { categoryTypeRepository } from "./category-type.repository"
import { GetCategoryTypeInput } from "./category-type.schema"

export const categoryTypeService = {
  async getCategoryTypes(params: GetCategoryTypeInput) {
    const categories = await categoryTypeRepository.find(params)
    const total = await categoryTypeRepository.count(params.search)
    return { data: categories, meta: { total, page: params.page, limit: params.limit } }
  }
}