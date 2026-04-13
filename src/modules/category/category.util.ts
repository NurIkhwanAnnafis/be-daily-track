import { categoryRepository } from "./category.repository"

type CategoryRow = Awaited<ReturnType<typeof categoryRepository.findById>>

export function formatCategory(category: NonNullable<CategoryRow>) {
  return {
    id: category.id,
    name: category.name,
    organization_name: category.organization?.name ?? null,
    category_types: category.categoryTypes?.map(ct => ct.categoryType.name) ?? [],
    created_at: category.createdAt,
    updated_at: category.updatedAt,
    deleted_at: category.deletedAt,
  }
}