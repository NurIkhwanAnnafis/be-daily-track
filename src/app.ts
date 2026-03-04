import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { env } from './config/env'
import { errorHandler } from './shared/errors/error-handler'
import { userController } from './modules/user/user.controller'
import { authController } from './modules/auth/auth.controller'
import { organizationController } from './modules/organization/organization.controller'
import { categoryController } from './modules/category/category.controller'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  })

  // Security & utility plugins
  await app.register(helmet)
  await app.register(cors, {
    origin: env.NODE_ENV === 'production' ? false : true,
  })
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Global error handler
  app.setErrorHandler(errorHandler)

  // Routes — versioned under /api/v1
  await app.register(
    async (v1) => {
      await v1.register(authController)
      await v1.register(userController)
      await v1.register(organizationController)
      await v1.register(categoryController)
    },
    { prefix: '/api/v1' }
  )

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}
