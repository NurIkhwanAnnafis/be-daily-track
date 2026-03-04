import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { createCategorySchema, getCategorySchema, getCategoryIdSchema, updateCategorySchema } from "./category.schema";
import { AppError } from "../../shared/errors/app-error";
import { categoryService } from "./category.service";
import { paginatedResponse } from "../../shared/utils/response";

export async function categoryController(app: FastifyInstance) {
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    protected_.get('/categories', async (req, reply) => {
      const result = getCategorySchema.safeParse(req.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const categories = await categoryService.getCategories(result.data)
      return reply.status(200).send(paginatedResponse(categories.data, categories.meta.total, categories.meta.page, categories.meta.limit))
    })

    protected_.post('/categories', async (req, reply) => {
      const result = createCategorySchema.safeParse(req.body)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const category = await categoryService.createCategory(result.data)
      return reply.status(201).send(category)
    })

    protected_.get('/categories/:id', async (req, reply) => {
      const result = getCategoryIdSchema.safeParse(req.params)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const category = await categoryService.getCategoryById(result.data.id)
      return reply.status(200).send(category)
    })

    protected_.put('/categories/:id', async (req, reply) => {
      const paramsResult = getCategoryIdSchema.safeParse(req.params)
      if (!paramsResult.success) {
        throw new AppError(paramsResult.error.issues[0].message, 400)
      }

      const bodyResult = updateCategorySchema.safeParse(req.body)
      if (!bodyResult.success) {
        throw new AppError(bodyResult.error.issues[0].message, 400)
      }

      const category = await categoryService.updateCategory(paramsResult.data.id, bodyResult.data)
      return reply.status(200).send(category)
    })

    protected_.delete('/categories/:id', async (req, reply) => {
      const result = getCategoryIdSchema.safeParse(req.params)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const category = await categoryService.deleteCategory(result.data.id)
      return reply.status(200).send(category)
    })
  })
}