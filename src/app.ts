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
import { categoryTypeController } from './modules/category-type/category-type.controller'
import { incomeController } from './modules/transaction/income/income.controller'
import { expenseController } from './modules/transaction/expense/expense.controller'
import { userConfigController } from './modules/user-config/user-config.controller'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  })

  // Security & utility plugins
  await app.register(helmet)
  await app.register(cors, {
    // origin: env.NODE_ENV === 'production' ? false : true,
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
      await v1.register(categoryTypeController)
      await v1.register(incomeController)
      await v1.register(expenseController)
      await v1.register(userConfigController)
    },
    { prefix: '/api/v1' }
  )

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  return app
}
