import { db } from "../../../shared/database"
import { transactionStatus } from "../../../shared/database/schema"
import { eq } from "drizzle-orm"

export const statusRepository = {
  findById(id: number) {
    return db.query.transactionStatus.findFirst({
      where: eq(transactionStatus.id, id),
      columns: {
        id: true,
        name: true,
      }
    })
  }
}