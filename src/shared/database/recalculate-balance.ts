import 'dotenv/config'
import { db } from '.'
import { transactions, usersConfig } from './schema'
import { and, eq, isNull, sql } from 'drizzle-orm'

// Transaction type IDs (matches seed data)
const INCOME_TYPE_ID = 1
const EXPENSE_TYPE_ID = 2

async function recalculateBalance(targetUserId?: string) {
  console.log('💰 Starting balance recalculation...')
  if (targetUserId) {
    console.log(`   → Targeting user: ${targetUserId}`)
  } else {
    console.log('   → Targeting ALL users')
  }

  // ─── Fetch all user configs (or a specific one) ────────────────────────────
  const configs = await db
    .select({ id: usersConfig.id, userId: usersConfig.userId, config: usersConfig.config })
    .from(usersConfig)
    .where(targetUserId ? eq(usersConfig.userId, targetUserId) : undefined)

  if (configs.length === 0) {
    console.warn('⚠️  No user config records found.')
    process.exit(0)
  }

  console.log(`\n📋 Found ${configs.length} user config(s) to process.\n`)

  // ─── Process each user ─────────────────────────────────────────────────────
  for (const config of configs) {
    const userId = config.userId

    // Sum all non-deleted income transactions
    const [incomeResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.typeId, INCOME_TYPE_ID),
          isNull(transactions.deletedAt)
        )
      )

    // Sum all non-deleted expense transactions
    const [expenseResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.typeId, EXPENSE_TYPE_ID),
          isNull(transactions.deletedAt)
        )
      )

    const totalIncome = BigInt(incomeResult.total)
    const totalExpense = BigInt(expenseResult.total)
    const currentAmount = (totalIncome - totalExpense).toString()

    const existingConfig = config.config as Record<string, unknown>

    // Update config JSON, preserving all existing fields
    await db
      .update(usersConfig)
      .set({
        config: {
          ...existingConfig,
          ...(!existingConfig.createdAt && { createdAt: new Date().toISOString() }),
          currentAmount,
          updatedAt: new Date().toISOString(),
        },
      })
      .where(eq(usersConfig.userId, userId))

    console.log(`✅ user: ${userId}`)
    console.log(`   income:  ${totalIncome}`)
    console.log(`   expense: ${totalExpense}`)
    console.log(`   currentAmount → ${currentAmount}\n`)
  }

  console.log('🎉 Recalculation complete!')
  process.exit(0)
}

// Allow passing a specific user_id as CLI argument:
//   npx tsx src/shared/database/recalculate-balance.ts <user_id>
const targetUserId = process.argv[2]
recalculateBalance(targetUserId).catch((err) => {
  console.error('❌ Recalculation failed:', err)
  process.exit(1)
})
