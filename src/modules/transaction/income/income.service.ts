import { incomeRepository } from "./income.repository"
import { CreateIncomeInput, GetIncomeInput, UpdateStatusIncomeInput } from "./income.schema"
import { JwtPayload } from "../../../shared/utils/jwt"

export const incomeService = {
  async getIncomes(params: GetIncomeInput, user: JwtPayload) {
    const [incomes, total] = await Promise.all([
      incomeRepository.find(params, user),
      incomeRepository.count(params, user)
    ])
    return { data: incomes, meta: { total, page: params.page, limit: params.limit } }
  }
}