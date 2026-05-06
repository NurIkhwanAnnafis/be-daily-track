import { FastifyInstance } from "fastify"
import { authMiddleware } from "../../shared/middleware/auth.middleware"
import { AppError } from "../../shared/errors/app-error"
import { dashboardService } from "./dashboard.service"
import { successResponse } from "../../shared/utils/response"
import { getDashboardTransactionSchema } from "./dashboard.schema"

export async function dashboardController(app: FastifyInstance) {
  app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    protected_.get("/dashboard/transaction-trend-six-last-month", async (request, reply) => {
      const result = getDashboardTransactionSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const transaction = await dashboardService.getTransactionTrendSixLastMonth(result.data.date, request.user)
      return reply.status(200).send(successResponse(transaction, "Transaction trend six last month retrieved successfully"))
    })

    protected_.get("/dashboard/transaction-expense", async (request, reply) => {
      const result = getDashboardTransactionSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const transaction = await dashboardService.getTransactionExpense(result.data.date, request.user)
      return reply.status(200).send(successResponse(transaction, "Transaction expense retrieved successfully"))
    })

    protected_.get("/dashboard/transaction-income", async (request, reply) => {
      const result = getDashboardTransactionSchema.safeParse(request.query)
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400)
      }

      const transaction = await dashboardService.getTransactionIncome(result.data.date, request.user)
      return reply.status(200).send(successResponse(transaction, "Transaction income retrieved successfully"))
    })
  })
}