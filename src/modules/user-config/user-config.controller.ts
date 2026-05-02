import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { createConfigSchema } from "./user-config.schema";
import { AppError } from "../../shared/errors/app-error";
import { userConfigService } from "./user-config.service";

export async function userConfigController(app: FastifyInstance) {
  await app.register(async (protected_)=>{
    protected_.addHook('preHandler', authMiddleware)

    protected_.get('/config-user', async (req, reply) => {
      const config = await userConfigService.getByUserId(req.user.sub)
      return reply.status(200).send(config)
    })

    protected_.post('/config-user', async (req, reply) => {
      const result = createConfigSchema.safeParse(req.body)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const config = await userConfigService.create(req.user.sub, result.data)
      return reply.status(201).send(config)
    })

    protected_.put('/config-user', async (req, reply) => {
      const result = createConfigSchema.safeParse(req.body)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const config = await userConfigService.update(req.user.sub, result.data)
      return reply.status(200).send(config)
    })
  })
}