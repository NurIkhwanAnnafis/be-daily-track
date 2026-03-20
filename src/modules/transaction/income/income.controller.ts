import { FastifyInstance } from "fastify";
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionSchema,
  updateStatusTransactionSchema,
} from "../transaction.schema";
import { AppError } from "../../../shared/errors/app-error";
import { incomeService } from "../income/income.service";
import { paginatedResponse } from "../../../shared/utils/response";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";

export const incomeController = async (app: FastifyInstance) => {
  await app.register(async (protected_) => {
    protected_.addHook('preHandler', authMiddleware)

    // GET /incomes
    protected_.get("/incomes", async (request, reply) => {
      const result = getTransactionSchema.safeParse(request.query);
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
      }
      const incomes = await incomeService.getIncomes(result.data, request.user);
      return reply
        .status(200)
        .send(
          paginatedResponse(
            incomes.data,
            incomes.meta.total,
            incomes.meta.page,
            incomes.meta.limit
          )
        );
    });

    // POST /incomes
    protected_.post("/incomes", async (request, reply) => {
      const result = createTransactionSchema.safeParse(request.body);
      if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
      }
      const income = await incomeService.createIncome(result.data, request.user);
      return reply.status(201).send(income);
    });

    // PATCH /incomes/:id/status
    protected_.patch(
      "/incomes/:id/status",
      async (request, reply) => {
        const result = updateStatusTransactionSchema.safeParse(request.body);
        if (!result.success) {
          throw new AppError(result.error.issues[0].message, 400);
        }
        await incomeService.updateStatusIncome(result.data.id, Number(result.data.statusId));
        return reply.status(200).send({ message: "Status updated" });
      }
    );

    // DELETE /incomes/:id
    protected_.delete(
      "/incomes/:id",
      async (request, reply) => {
        const result = deleteTransactionSchema.safeParse(request.params);
        if (!result.success) {
          throw new AppError(result.error.issues[0].message, 400);
        }
        await incomeService.deleteIncome(result.data.id);
        return reply.status(200).send({ message: "Income deleted" });
      }
    );
  });
};