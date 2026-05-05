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
  decimal,
  primaryKey
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
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
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
    },
    initialAmount: decimal('initial_amount').notNull().default('0'),
    currentAmount: decimal('current_amount').notNull().default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
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
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true })
}, (table) => [
  index('categories_org_index').on(table.organizationId),
])

export const categoryCategories = pgTable('category_category_type', {
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  typeId: integer('type_id').notNull().references(() => categoryType.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.categoryId, table.typeId] }),
  index('category_category_type_category_index').on(table.categoryId),
  index('category_category_type_type_index').on(table.typeId),
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
  categoryCategories: many(categoryCategories),
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

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  categoryTypes: many(categoryCategories),
}))

export const categoryCategoriesRelations = relations(categoryCategories, ({ one }) => ({
  category: one(categories, {
    fields: [categoryCategories.categoryId],
    references: [categories.id],
  }),
  categoryType: one(categoryType, {
    fields: [categoryCategories.typeId],
    references: [categoryType.id],
  }),
}))
