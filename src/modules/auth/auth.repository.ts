import { eq, and, isNull, gt } from 'drizzle-orm'
import { db } from '../../shared/database'
import { refreshTokens, users } from '../../shared/database/schema'

export const authRepository = {
  findUserByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) })
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    await db.insert(refreshTokens).values({ userId, token, expiresAt })
  },

  findRefreshToken(token: string) {
    return db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      ),
    })
  },

  async revokeRefreshToken(token: string) {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.token, token))
  },
}
