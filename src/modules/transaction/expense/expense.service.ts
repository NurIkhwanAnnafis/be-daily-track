import { JwtPayload } from "../../../shared/utils/jwt"
import { transactionRepository } from "../transaction.reposistory"
import { CreateTransactionInput, GetTransactionInput, UpdateTransactionInput } from "../transaction.schema"
import { TRANSACTION_TYPE } from "../transaction.constant"
import { isValidFormatDate } from "../../../shared/utils/date"
import { AppError } from "../../../shared/errors/app-error"
import { categoryRepository } from "../../category/category.repository"
import { keysToSnakeCase } from "../../../shared/utils/object"
import { statusRepository } from "../status/status.repository"
import { UserConfig } from "../transaction.type"

export const expenseService = {
  async getExpenses(params: GetTransactionInput, user: JwtPayload) {
    const [expenses, total] = await Promise.all([
      transactionRepository.find(params, TRANSACTION_TYPE.EXPENSE, user),
      transactionRepository.count(params, TRANSACTION_TYPE.EXPENSE, user)
    ])
    const data = expenses.map(expense => ({
      ...keysToSnakeCase(expense),
      amount: Number(expense.amount),
    }))

    return { data, meta: { total, page: params.page, limit: params.limit } }
  },

  async getExpenseById(id: string) {
    const expense = await transactionRepository.findById(id)
    if (!expense) {
      throw new AppError("Expense not found", 404)
    }
    return {
      ...keysToSnakeCase(expense),
      amount: Number(expense.amount),
    }
  },

  async createExpense(data: CreateTransactionInput, user: JwtPayload) {
    if (!isValidFormatDate(data.date)) {
      throw new AppError("Invalid date format", 400);
    }

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new AppError("Category not found", 404)
    }

    if (!category.categoryTypes.find(t => t.typeId === TRANSACTION_TYPE.EXPENSE)) {
      throw new AppError("Category type is not expense", 400)
    }

    const config = await transactionRepository.findConfigUser(user)
    if (config) {
      const userConfig = config.config as UserConfig
      const currentAmount = BigInt(userConfig?.currentAmount ?? '0') - BigInt(data.amount)
      await transactionRepository.updateCurrentAmount(user.sub, currentAmount)
    }

    const expense = await transactionRepository.create(data, TRANSACTION_TYPE.EXPENSE, user)
    return keysToSnakeCase(expense[0])
  },

  async updateExpense(id: string, data: UpdateTransactionInput, user: JwtPayload) {
    const expenseExist = await transactionRepository.findById(id)
    if (!expenseExist) {
      throw new AppError("Expense not found", 404)
    }

    if (!isValidFormatDate(data.date)) {
      throw new AppError("Invalid date format", 400);
    }

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new AppError("Category not found", 404)
    }

    if (!category.categoryTypes.find(t => t.typeId === TRANSACTION_TYPE.EXPENSE)) {
      throw new AppError("Category type is not expense", 400)
    }

    if (BigInt(expenseExist.amount) !== BigInt(data.amount)) {
      const config = await transactionRepository.findConfigUser(user)
      if (config) {
        const userConfig = config.config as UserConfig
        const currentAmount = BigInt(userConfig?.currentAmount ?? '0') + BigInt(expenseExist.amount) - BigInt(data.amount)
        await transactionRepository.updateCurrentAmount(user.sub, currentAmount)
      }
    }

    const expense = await transactionRepository.update(id, data)
    return keysToSnakeCase(expense[0])
  },

  async updateStatusExpense(id: string, statusId: number) {
    const expenseExist = await transactionRepository.findById(id)
    if (!expenseExist) {
      throw new AppError("Expense not found", 404)
    }

    const statusExist = await statusRepository.findById(statusId)
    if (!statusExist) {
      throw new AppError("Status not found", 404)
    }

    const expense = await transactionRepository.updateStatus(id, statusId)
    return keysToSnakeCase(expense[0])
  },

  async deleteExpense(id: string, user: JwtPayload) {
    const expenseExist = await transactionRepository.findById(id)
    if (!expenseExist) {
      throw new AppError("Expense not found", 404)
    }

    const config = await transactionRepository.findConfigUser(user)
    if (config) {
      const userConfig = config.config as UserConfig
      const currentAmount = BigInt(userConfig?.currentAmount ?? '0') + BigInt(expenseExist.amount)
      await transactionRepository.updateCurrentAmount(user.sub, currentAmount)
    }

    const expense = await transactionRepository.delete(id)
    return expense
  }
}