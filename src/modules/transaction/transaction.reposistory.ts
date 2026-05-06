import { and, count, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { db } from "../../shared/database"
import { JwtPayload } from "../../shared/utils/jwt"
import { transactions, usersConfig } from "../../shared/database/schema"
import { TRANSACTION_STATUS } from "./transaction.constant"
import { CreateTransactionInput, FindTransactionParams, GetTransactionInput, UpdateTransactionInput } from "./transaction.schema"

export const transactionRepository = {
  find(params: FindTransactionParams, typeId: number | undefined, user: JwtPayload) {
    return db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, user.sub),
        typeId ? eq(transactions.typeId, typeId) : undefined,
        params.status_id ? eq(transactions.statusId, Number(params.status_id)) : undefined,
        params.start_date ? sql`DATE(${transactions.date}) >= ${params.start_date}` : undefined,
        params.end_date ? sql`DATE(${transactions.date}) <= ${params.end_date}` : undefined,
        params.date ? sql`DATE(${transactions.date}) = ${params.date}` : undefined,
        params.category_id ? eq(transactions.categoryId, params.category_id) : undefined,
        params.search ?
          or(
            ilike(transactions.merchantName, `%${params.search}%`),
            ilike(transactions.description, `%${params.search}%`),
          ) : undefined,
        isNull(transactions.deletedAt)
      ),
      ...(params.limit && params.page ? {
        limit: params.limit,
        offset: (params.page - 1) * params.limit,
      } : {}),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      columns: {
        id: true,
        merchantName: true,
        amount: true,
        date: true,
        description: true,
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
        merchantName: true,
        amount: true,
        date: true,
        description: true,
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

  async count(params: GetTransactionInput, typeId: number | undefined, user: JwtPayload) {
    const result = await db
      .select({ value: count() })
      .from(transactions)
      .where(and(
        eq(transactions.userId, user.sub),
        typeId ? eq(transactions.typeId, typeId) : undefined,
        params.status_id ? eq(transactions.statusId, Number(params.status_id)) : undefined,
        params.start_date ? sql`DATE(${transactions.date}) >= ${params.start_date}` : undefined,
        params.end_date ? sql`DATE(${transactions.date}) <= ${params.end_date}` : undefined,
        params.date ? sql`DATE(${transactions.date}) = ${params.date}` : undefined,
        params.category_id ? eq(transactions.categoryId, params.category_id) : undefined,
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

  create(data: CreateTransactionInput, typeId: number, user: JwtPayload) {
    return db.insert(transactions).values({
      amount: String(data.amount),
      statusId: TRANSACTION_STATUS.CREATED,
      typeId,
      userId: user.sub,
      date: new Date(data.date),
      merchantName: data.merchant_name,
      categoryId: data.category_id,
      description: data.description,
      createdAt: new Date(),
    }).returning({ id: transactions.id })
  },

  update(id: string, data: UpdateTransactionInput) {
    return db.update(transactions).set({
      amount: String(data.amount),
      date: new Date(data.date),
      merchantName: data.merchant_name,
      categoryId: data.category_id,
      description: data.description,
      updatedAt: new Date(),
    }).where(eq(transactions.id, id)).returning({ id: transactions.id })
  },

  updateStatus(id: string, statusId: number) {
    return db.update(transactions).set({
      statusId,
      updatedAt: new Date(),
    }).where(eq(transactions.id, id)).returning({ id: transactions.id })
  },

  delete(id: string) {
    return db.update(transactions).set({ updatedAt: new Date(), deletedAt: new Date() }).where(eq(transactions.id, id))
  },

  findConfigUser(user: JwtPayload) {
    return db.query.usersConfig.findFirst({
      where: eq(usersConfig.userId, user.sub),
    })
  },

  updateCurrentAmount(userId: string, currentAmount: bigint) {
    return db.update(usersConfig).set({
      config: {
        ...usersConfig.config,
        currentAmount: currentAmount.toString(), // BigInt is not JSON-serializable
        updatedAt: new Date().toISOString(),
      },
    }).where(eq(usersConfig.userId, userId)).returning({ id: usersConfig.id })
  }
}
