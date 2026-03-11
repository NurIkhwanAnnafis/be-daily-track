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
  index,
  jsonb,
  integer,
  decimal
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

export const usersConfig = pgTable('users_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  config: jsonb('config').notNull().default({
    expense: {
      limit_per_day: 0,
      limit_per_month: 0,
    },
    income: {
      limit_per_day: 0,
      limit_per_month: 0,
    }
  })
})

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
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
})

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  typeId: integer('type_id').notNull().references(() => categoryType.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  index('categories_org_index').on(table.organizationId),
  index('categories_type_index').on(table.typeId)
])

export const transactionStatus = pgTable('transaction_status', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const transactionTypes = pgTable('transaction_types', {
  id: integer('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  merchantName: varchar('merchant_name', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  typeId: integer('type_id').notNull().references(() => transactionTypes.id),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  statusId: integer('status_id').notNull().references(() => transactionStatus.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  index('transactions_type_index').on(table.typeId),
  index('transactions_user_index').on(table.userId)
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
  categories: many(categories),
}))

export const categoryTypeRelations = relations(categoryType, ({ many }) => ({
  categories: many(categories),
}))

export const transactionStatusRelations = relations(transactionStatus, ({ many }) => ({
  transactions: many(transactions),
}))

export const transactionTypeRelations = relations(transactionTypes, ({ many }) => ({
  transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  status: one(transactionStatus, {
    fields: [transactions.statusId],
    references: [transactionStatus.id],
  }),
  type: one(transactionTypes, {
    fields: [transactions.typeId],
    references: [transactionTypes.id],
  }),
}))

export const categoriesRelations = relations(categories, ({ one }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  category: one(categoryType, {
    fields: [categories.typeId],
    references: [categoryType.id],
  }),
}))
