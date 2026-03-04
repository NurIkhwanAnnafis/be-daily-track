import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  varchar,
  pgEnum,
  uniqueIndex,
  index
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "member"
]);

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('member'),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  uniqueIndex('email_org_unique').on(table.email, table.organizationId),
  index('users_org_index').on(table.organizationId)
])

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('refresh_tokens_user_index').on(table.userId),
  index('refresh_tokens_token_index').on(table.token),
])

export const categoryType = pgTable('category_type', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  index('category_type_org_index').on(table.organizationId)
])

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  typeId: uuid('type_id').notNull().references(() => categoryType.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  index('categories_org_index').on(table.organizationId),
  index('categories_type_index').on(table.typeId)
])

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}))

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
}))
