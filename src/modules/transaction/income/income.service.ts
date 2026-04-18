import { JwtPayload } from "../../../shared/utils/jwt"
import { transactionRepository } from "../transaction.reposistory"
import { CreateTransactionInput, GetTransactionInput, UpdateTransactionInput } from "../transaction.schema"
import { TRANSACTION_TYPE } from "../transaction.constant"
import { keysToSnakeCase } from "../../../shared/utils/object"
import { AppError } from "../../../shared/errors/app-error"
import { isValidFormatDate } from "../../../shared/utils/date"
import { categoryRepository } from "../../category/category.repository"
import { statusRepository } from "../status/status.repository"

export const incomeService = {
  async getIncomes(params: GetTransactionInput, user: JwtPayload) {
    const [incomes, total] = await Promise.all([
      transactionRepository.find(params, TRANSACTION_TYPE.INCOME, user),
      transactionRepository.count(params, TRANSACTION_TYPE.INCOME, user)
    ])

    const data = incomes.map(income => ({
      ...keysToSnakeCase(income),
      amount: Number(income.amount),
    }))

    return { data, meta: { total, page: params.page, limit: params.limit } }
  },

  async createIncome(data: CreateTransactionInput, user: JwtPayload) {
    if (!isValidFormatDate(data.date)) {
      throw new AppError("Invalid date format", 400)
    }

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new AppError("Category not found", 404)
    }

    if (!category.categoryTypes.find(t => t.typeId === TRANSACTION_TYPE.INCOME)) {
      throw new AppError("Category type is not income", 400)
    }

    const income = await transactionRepository.create(data, TRANSACTION_TYPE.INCOME, user)
    return keysToSnakeCase(income[0])
  },

  async updateIncome(id: string, data: UpdateTransactionInput) {
    const incomeExist = await transactionRepository.findById(id)
    if (!incomeExist) {
      throw new AppError("Income not found", 404)
    }

    if (!isValidFormatDate(data.date)) {
      throw new AppError("Invalid date format", 400)
    }

    const category = await categoryRepository.findById(data.category_id)
    if (!category) {
      throw new AppError("Category not found", 404)
    }

    if (!category.categoryTypes.find(t => t.typeId === TRANSACTION_TYPE.INCOME)) {
      throw new AppError("Category type is not income", 400)
    }

    const income = await transactionRepository.update(id, data)
    return keysToSnakeCase(income[0])
  },

  async updateStatusIncome(id: string, statusId: number) {
    const incomeExist = await transactionRepository.findById(id)
    if (!incomeExist) {
      throw new AppError("Income not found", 404)
    }

    const status = await statusRepository.findById(statusId)
    if (!status) {
      throw new AppError("Status not found", 404)
    }

    const income = await transactionRepository.updateStatus(id, statusId)
    return keysToSnakeCase(income[0])
  },

  async deleteIncome(id: string) {
    const incomeExist = await transactionRepository.findById(id)
    if (!incomeExist) {
      throw new AppError("Income not found", 404)
    }

    const income = await transactionRepository.delete(id)
    return keysToSnakeCase(income)
  }
}