import { FastifyInstance } from 'fastify'
import { loginSchema, refreshSchema } from './auth.schema'
import { authService } from './auth.service'
import { authMiddleware } from '../../shared/middleware/auth.middleware'
import { successResponse } from '../../shared/utils/response'
import { AppError } from '../../shared/errors/app-error'

export async function authController(app: FastifyInstance) {
  app.post('/auth/login', async (req, reply) => {
    const result = loginSchema.safeParse(req.body)
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400)
    }

    const tokens = await authService.login(result.data)
    return reply.status(200).send(successResponse(tokens, 'Login successful'))
  })

  app.post('/auth/refresh', async (req, reply) => {
    const result = refreshSchema.safeParse(req.body)
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400)
    }

    const tokens = await authService.refresh(result.data.refresh_token)
    return reply.status(200).send(successResponse(tokens, 'Token refreshed'))
  })

  app.post('/auth/logout', {
    preHandler: authMiddleware,
  }, async (req, reply) => {
    const result = refreshSchema.safeParse(req.body)
    if (!result.success) {
      throw new AppError('refresh_token is required', 400)
    }

    await authService.logout(result.data.refresh_token)
    return reply.status(200).send(successResponse(null, 'Logged out successfully'))
  })
}
