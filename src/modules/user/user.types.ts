import type { users } from '../../shared/database/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type SafeUser = Omit<User, 'passwordHash'>
