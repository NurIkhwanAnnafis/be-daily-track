import { FastifyInstance } from "fastify";
import { getAllCategoryTypeSchema, getCategoryTypeSchema } from "./category-type.schema";
import { AppError } from "../../shared/errors/app-error";
import { categoryTypeService } from "./category-type.service";
import { paginatedResponse } from "../../shared/utils/response";

export const categoryTypeController = async (app: FastifyInstance) => {
  await app.register(async (protected_) => {
    protected_.get('/category-types', async (request, reply) => {
      const result = getCategoryTypeSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const categoryTypes = await categoryTypeService.getCategoryTypes(result.data)
      return reply.status(200).send(paginatedResponse(categoryTypes.data, categoryTypes.meta.total, categoryTypes.meta.page, categoryTypes.meta.limit))
    })

    protected_.get('/category-types/all', async (request, reply) => {
      const result = getAllCategoryTypeSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const categoryTypes = await categoryTypeService.getAllCategoryTypes(result.data)
      return reply.status(200).send(paginatedResponse(categoryTypes.data, categoryTypes.meta.total, categoryTypes.meta.page, categoryTypes.meta.limit))
    })
  })
}