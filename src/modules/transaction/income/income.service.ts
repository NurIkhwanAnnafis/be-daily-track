import { JwtPayload } from "../../../shared/utils/jwt"
import { transactionRepository } from "../transaction.reposistory"
import { CreateTransactionInput, GetTransactionInput } from "../transaction.schema"
import { TRANSACTION_TYPE } from "../transaction.constant"

export const incomeService = {
  async getIncomes(params: GetTransactionInput, user: JwtPayload) {
    const [incomes, total] = await Promise.all([
      transactionRepository.find(params, TRANSACTION_TYPE.INCOME, user),
      transactionRepository.count(params, TRANSACTION_TYPE.INCOME, user)
    ])
    return { data: incomes, meta: { total, page: params.page, limit: params.limit } }
  },

  async createIncome(data: CreateTransactionInput, user: JwtPayload) {
    return transactionRepository.create(data, TRANSACTION_TYPE.INCOME, user)
  },

  async updateStatusIncome(id: string, statusId: number) {
    return transactionRepository.updateStatus(id, statusId)
  },

  async deleteIncome(id: string) {
    return transactionRepository.delete(id)
  }
}