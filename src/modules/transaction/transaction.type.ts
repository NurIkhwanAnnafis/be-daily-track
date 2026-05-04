import { transactionRepository } from "./transaction.reposistory";

export type Transaction = Awaited<ReturnType<typeof transactionRepository.find>>