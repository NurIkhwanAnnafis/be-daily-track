import { and, count, eq, ilike, or } from "drizzle-orm"
import { db } from "../../../shared/database"
import { CreateIncomeInput, GetIncomeInput } from "./income.schema"
import { transactions } from "../../../shared/database/schema"
import { JwtPayload } from "../../../shared/utils/jwt"
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../transaction.constant"

export const incomeRepository = {
  find(params: GetIncomeInput, user: JwtPayload) {
    return db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, user.sub),
        params.typeId ? eq(transactions.typeId, Number(params.typeId)) : undefined,
        params.statusId ? eq(transactions.statusId, Number(params.statusId)) : undefined,
        params.date ? eq(transactions.date, new Date(params.date)) : undefined,
        params.search ?
          or(
            ilike(transactions.merchantName, `%${params.search}%`),
            ilike(transactions.description, `%${params.search}%`),
            ilike(transactions.amount, `%${params.search}%`),
          ) : undefined,
      ),
      limit: params.limit,
      offset: (params.page - 1) * params.limit,
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      columns: {
        id: true,
        amount: true,
        date: true,
        description: true,
        statusId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        type: {
          columns: {
            id: true,
            name: true,
          }
        },
        status: {
          columns: {
            id: true,
            name: true,
          }
        },
        category: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })
  },

  findById(id: string) {
    return db.query.transactions.findFirst({
      where: eq(transactions.id, id),
      columns: {
        id: true,
        amount: true,
        date: true,
        description: true,
        statusId: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        type: {
          columns: {
            id: true,
            name: true,
          }
        },
        status: {
          columns: {
            id: true,
            name: true,
          }
        },
        category: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })
  },

  async count(params: GetIncomeInput, user: JwtPayload) {
    const result = await db
      .select({ value: count() })
      .from(transactions)
      .where(and(
        eq(transactions.userId, user.sub),
        params.typeId ? eq(transactions.typeId, Number(params.typeId)) : undefined,
        params.statusId ? eq(transactions.statusId, Number(params.statusId)) : undefined,
        params.date ? eq(transactions.date, new Date(params.date)) : undefined,
        params.search ?
          or(
            ilike(transactions.merchantName, `%${params.search}%`),
            ilike(transactions.description, `%${params.search}%`),
            ilike(transactions.amount, `%${params.search}%`),
          ) : undefined,
      ),
      )

    return result[0].value
  },

  create(data: CreateIncomeInput, user: JwtPayload) {
    return db.insert(transactions).values({
      ...data,
      statusId: TRANSACTION_STATUS.CREATED,
      typeId: TRANSACTION_TYPE.INCOME,
      userId: user.sub,
      date: new Date(data.date),
    }).returning({ id: transactions.id })
  },

  updateStatus(id: string, statusId: number) {
    return db.update(transactions).set({
      statusId,
      updatedAt: new Date(),
    }).where(eq(transactions.id, id)).returning({ id: transactions.id })
  },

  delete(id: string) {
    return db.update(transactions).set({ updatedAt: new Date(), deletedAt: new Date() }).where(eq(transactions.id, id))
  }
}