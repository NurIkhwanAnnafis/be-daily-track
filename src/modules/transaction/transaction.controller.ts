import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { getTransactionSchema } from "./transaction.schema";
import { AppError } from "../../shared/errors/app-error";
import { TransactionService } from "./transaction.service";
import { paginatedResponse } from "../../shared/utils/response";

export async function transactionController(app: FastifyInstance) {
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    // GET /transactions
    protected_.get("/transactions", async (request, reply) => {
      const result = getTransactionSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }
      const transactions = await TransactionService.getTransaction(result.data, request.user)
      return reply.status(200).send(
        paginatedResponse(
          transactions.data,
          transactions.pagination.total,
          transactions.pagination.page,
          transactions.pagination.limit
        )
      )
    })
  })
}