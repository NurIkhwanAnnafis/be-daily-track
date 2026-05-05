import { transactionRepository } from "./transaction.reposistory";

export type Transaction = Awaited<ReturnType<typeof transactionRepository.find>>

export type UserConfig = {
  currentAmount?: string
  initialAmount?: string
  expense?: { limit_per_day: number; limit_per_month: number }
  income?: { limit_per_day: number; limit_per_month: number }
  createdAt?: string
  updatedAt?: string
}