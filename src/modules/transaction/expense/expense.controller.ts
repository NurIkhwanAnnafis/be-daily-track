import { FastifyInstance } from "fastify";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionIdSchema,
  getTransactionSchema,
  updateStatusTransactionSchema,
  updateTransactionSchema,
} from "../transaction.schema";
import { AppError } from "../../../shared/errors/app-error";
import { paginatedResponse } from "../../../shared/utils/response";
import { expenseService } from "./expense.service";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";

export const expenseController = async (app: FastifyInstance) => {
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    // GET /expenses
    protected_.get("/expenses", async (request, reply) => {
      const result = getTransactionSchema.safeParse(request.query);
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
      }
      const expenses = await expenseService.getExpenses(result.data, request.user);
      return reply
        .status(200)
        .send(
          paginatedResponse(
            expenses.data,
            expenses.meta.total,
            expenses.meta.page,
            expenses.meta.limit
          )
        );
    });

    // POST /expenses
    protected_.post("/expenses", async (request, reply) => {
      const result = createTransactionSchema.safeParse(request.body);
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
      }
      const expense = await expenseService.createExpense(result.data, request.user);
      return reply.status(201).send(expense);
    });

    // PUT /expenses/:id
    protected_.put("/expenses/:id", async (request, reply) => {
      const paramsResult = getTransactionIdSchema.safeParse(request.params)
      if (!paramsResult.success) {
        throw new AppError(paramsResult.error.issues[0].message, 400)
      }

      const result = updateTransactionSchema.safeParse(request.body);
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
      }
      const expense = await expenseService.updateExpense(paramsResult.data.id, result.data);
      return reply.status(200).send(expense);
    });

    // PATCH /expenses/:id/status
    protected_.patch(
      "/expenses/:id/status",
      async (request, reply) => {
        const result = updateStatusTransactionSchema.safeParse(request.body);
        if (!result.success) {
          throw new AppError(result.error.issues[0].message, 400);
        }
        await expenseService.updateStatusExpense(result.data.id, Number(result.data.status_id));
        return reply.status(200).send({ message: "Status updated" });
      }
    );

    // DELETE /expenses/:id
    protected_.delete(
      "/expenses/:id",
      async (request, reply) => {
        const result = deleteTransactionSchema.safeParse(request.params);
        if (!result.success) {
          throw new AppError(result.error.issues[0].message, 400);
        }
        await expenseService.deleteExpense(result.data.id);
        return reply.status(200).send({ message: "Expense deleted" });
      }
    );
  });
};