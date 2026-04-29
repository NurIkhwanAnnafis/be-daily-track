import { FastifyInstance } from "fastify"
import { createUserSchema, getUserByIdSchema, getUsersSchema } from "./user.schema"
import { userService } from "./user.service"
import { paginatedResponse, successResponse } from "../../shared/utils/response"
import { AppError } from "../../shared/errors/app-error"
import { authMiddleware } from "../../shared/middleware/auth.middleware"

export async function userController(app: FastifyInstance) {
  // Protected routes — require valid Bearer token
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    protected_.get('/users', async (req, reply) => {
      const result = getUsersSchema.safeParse(req.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const users = await userService.getUsers(result.data)
      return reply.status(200).send(paginatedResponse(users.data, users.meta.total, users.meta.page, users.meta.limit))
    })

    protected_.post('/users', async (req, reply) => {
      const result = createUserSchema.safeParse(req.body)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const user = await userService.createUser(result.data)
      return reply.status(201).send(successResponse(user, 'User created successfully'))
    })

    protected_.get('/users/:id', async (req, reply) => {
      const result = getUserByIdSchema.safeParse(req.params)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const user = await userService.getUserById(result.data.id)
      return reply.status(200).send(user)
    })
  })
}
