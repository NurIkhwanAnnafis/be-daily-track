import { JwtPayload } from "../../shared/utils/jwt";
import { keysToSnakeCase } from "../../shared/utils/object";
import { transactionRepository } from "./transaction.reposistory";
import { GetTransactionInput } from "./transaction.schema";
import { UserConfig } from "./transaction.type";
import { transactionUtils } from "./transaction.util";

export const TransactionService = {
  async getTransaction(params: GetTransactionInput, user: JwtPayload) {
    const [transaction, count] = await Promise.all([
      transactionRepository.find(params, undefined, user),
      transactionRepository.count(params, undefined, user)
    ])

    return {
      data: keysToSnakeCase(transaction),
      pagination: {
        total: count,
        page: params.page,
        limit: params.limit,
        totalPage: Math.ceil(count / params.limit)
      }
    }
  },

  async getTransactionSummary(params: GetTransactionInput, user: JwtPayload) {
    const transaction = await transactionRepository.find(params, undefined, user)
    const result = transactionUtils.calculateTransactionSummary(transaction)

    const userConfig = await transactionRepository.findConfigUser(user)
    const config = userConfig?.config as UserConfig | undefined

    return {
      ...keysToSnakeCase(result),
      balance: Number(config?.currentAmount || 0)
    }
  }
}