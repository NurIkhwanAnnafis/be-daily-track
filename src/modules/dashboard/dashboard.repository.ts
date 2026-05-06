import { db } from "../../shared/database"
import { and, eq, inArray, sql } from "drizzle-orm"
import { categories, transactions } from "../../shared/database/schema"
import { JwtPayload } from "../../shared/utils/jwt"
import { FindTransactionInput } from "./dashboard.type"

export const dashboardRepository = {
  findTrendSixLastMonth(startDate: string, endDate: string, user: JwtPayload) {
    return db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, user.sub),
        sql`DATE(${transactions.date}) >= ${startDate}`,
        sql`DATE(${transactions.date}) <= ${endDate}`,
      ),
      orderBy: (table, { asc }) => [asc(table.date)],
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      with: {
        type: {
          columns: {
            id: true,
            name: true,
          }
        },
      }
    })
  },

  findCategory(user: JwtPayload) {
    return db.query.categories.findMany({
      where: eq(categories.organizationId, user.organizationId),
      columns: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      with: {
        organization: {
          columns: {
            id: true,
            name: true,
          }
        },
        categoryTypes: {
          with: {
            categoryType: {
              columns: { id: true, name: true }
            }
          }
        }
      }
    })
  },

  findTransaction(query: FindTransactionInput) {
    const { startDate, endDate, typeId, categoryIds, user } = query
    return db.query.transactions.findMany({
      where: and(
        eq(transactions.userId, user.sub),
        sql`DATE(${transactions.date}) >= ${startDate}`,
        sql`DATE(${transactions.date}) <= ${endDate}`,
        eq(transactions.typeId, typeId),
        categoryIds.length > 0 ? inArray(transactions.categoryId, categoryIds) : undefined,
      ),
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
  }
}