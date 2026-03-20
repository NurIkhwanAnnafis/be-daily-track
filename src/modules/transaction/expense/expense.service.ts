import { JwtPayload } from "../../../shared/utils/jwt"
import { transactionRepository } from "../transaction.reposistory"
import { CreateTransactionInput, GetTransactionInput } from "../transaction.schema"
import { TRANSACTION_TYPE } from "../transaction.constant"

export const expenseService = {
  async getExpenses(params: GetTransactionInput, user: JwtPayload) {
    const [expenses, total] = await Promise.all([
      transactionRepository.find(params, TRANSACTION_TYPE.EXPENSE, user),
      transactionRepository.count(params, TRANSACTION_TYPE.EXPENSE, user)
    ])
    return { data: expenses, meta: { total, page: params.page, limit: params.limit } }
  },

  async createExpense(data: CreateTransactionInput, user: JwtPayload) {
    return transactionRepository.create(data, TRANSACTION_TYPE.EXPENSE, user)
  },

  async updateStatusExpense(id: string, statusId: number) {
    return transactionRepository.updateStatus(id, statusId)
  },

  async deleteExpense(id: string) {
    return transactionRepository.delete(id)
  }
}