import { JwtPayload } from "../../shared/utils/jwt"

export type FindTransactionInput = {
  startDate: string
  endDate: string
  typeId: number
  categoryIds: string[]
  user: JwtPayload
}