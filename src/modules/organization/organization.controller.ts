import { FastifyInstance } from 'fastify'
import { createOrganizationSchema } from './organization.schema'
import { organizationService } from './organization.service'
import { successResponse } from '../../shared/utils/response'
import { AppError } from '../../shared/errors/app-error'
import { authMiddleware } from '../../shared/middleware/auth.middleware'

export async function organizationController(app: FastifyInstance) {
  // All organization routes are protected
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    protected_.post('/organizations', async (req, reply) => {
      const result = createOrganizationSchema.safeParse(req.body)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const org = await organizationService.create(result.data)
      return reply.status(201).send(successResponse(org, 'Organization created'))
    })

    protected_.get('/organizations/:id', async (req, reply) => {
      const { id } = req.params as { id: string }
      const org = await organizationService.findById(id)
      return reply.send(successResponse(org))
    })
  })
}
