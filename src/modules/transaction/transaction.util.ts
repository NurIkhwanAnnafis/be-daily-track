import { TRANSACTION_TYPE } from "./transaction.constant"
import { Transaction } from "./transaction.type"

export const transactionUtils = {
  calculateTransactionSummary(transaction: Transaction) {
    const total = transaction.reduce((acc: { income: number, expense: number }, transaction) => {
      if (transaction.type.id === TRANSACTION_TYPE.INCOME) {
        acc.income += Number(transaction.amount)
      } else {
        acc.expense += Number(transaction.amount)
      }
      return acc
    }, {
      income: 0,
      expense: 0,
    })

    const amount = total.income - total.expense

    return {
      income: total.income,
      expense: total.expense,
      amount,
    }
  }
}