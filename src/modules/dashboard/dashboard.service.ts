import dayjs from "dayjs";
import { JwtPayload } from "../../shared/utils/jwt";
import { TRANSACTION_TYPE } from "../transaction/transaction.constant";
import { dashboardRepository } from "./dashboard.repository";

export const dashboardService = {
  async getTransactionTrendSixLastMonth(date: string, user: JwtPayload) {
    const startDate = dayjs(date).startOf('month').subtract(6, 'month').format()
    const endDate = dayjs(date).endOf('month').format()

    const transaction = await dashboardRepository.findTrendSixLastMonth(startDate, endDate, user)
    let result: Array<{ month: string, income: number, expense: number }> = []
    for (let i = 5; i >= 0; i--) {
      const month = dayjs(date).subtract(i, 'month').format('MMM YY')
      const currentMonthData = transaction.filter((t) => dayjs(t.date).format('MMM YY') === month)
      if (currentMonthData.length === 0) {
        result.push({ month, income: 0, expense: 0 })
        continue
      }

      const tempMonthData = currentMonthData.reduce((acc, val) => {
        const income = val.type.id === TRANSACTION_TYPE.INCOME ? Number(val.amount) : 0
        const expense = val.type.id === TRANSACTION_TYPE.EXPENSE ? Number(val.amount) : 0

        const existingMonth = acc.find(item => item.month === month)
        if (existingMonth) {
          existingMonth.income += income
          existingMonth.expense += expense
        } else {
          acc.push({ month, income, expense })
        }
        return acc
      }, [] as Array<{ month: string, income: number, expense: number }>)

      result = result.concat(tempMonthData)
    }

    return result
  },

  async getTransactionExpense(date: string, user: JwtPayload) {
    const categories = await dashboardRepository.findCategory(user)
    const categoryIds = categories.map(c => c.id)

    const startDate = dayjs(date).startOf('month').format('YYYY-MM-DD')
    const endDate = dayjs(date).endOf('month').format('YYYY-MM-DD')

    const params = {
      startDate,
      endDate,
      typeId: TRANSACTION_TYPE.EXPENSE,
      categoryIds,
      user
    }

    const transaction = await dashboardRepository.findTransaction(params)
    const result: Array<{ name: string, total: number }> = []

    transaction.forEach(item => {
      result.push({ name: item.category.name, total: Number(item.amount) })
    })

    return result.sort((a, b) => b.total - a.total)
  },

  async getTransactionIncome(date: string, user: JwtPayload) {
    const categories = await dashboardRepository.findCategory(user)
    const categoryIds = categories.map(c => c.id)

    const startDate = dayjs(date).startOf('month').format('YYYY-MM-DD')
    const endDate = dayjs(date).endOf('month').format('YYYY-MM-DD')

    const params = {
      startDate,
      endDate,
      typeId: TRANSACTION_TYPE.INCOME,
      categoryIds,
      user
    }

    const transaction = await dashboardRepository.findTransaction(params)
    const result: Array<{ name: string, total: number }> = []

    transaction.forEach(item => {
      result.push({ name: item.category.name, total: Number(item.amount) })
    })

    return result.sort((a, b) => b.total - a.total)
  }
}