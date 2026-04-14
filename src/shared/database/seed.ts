import 'dotenv/config'
import { db } from '.'
import { categoryType, transactionStatus, transactionTypes } from './schema'
import { sql } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Seeding database...')

  // ─── Transaction Status ──────────────────────────────────────────────────
  await db
    .insert(transactionStatus)
    .values([
      { id: 1, name: 'pending' },
      { id: 2, name: 'created' },
      { id: 3, name: 'cancelled' },
    ])
    .onConflictDoUpdate({ target: transactionStatus.id, set: { name: sql`excluded.name` } })

  await db
    .insert(transactionTypes)
    .values([
      { id: 1, name: 'income' },
      { id: 2, name: 'expense' },
    ])
    .onConflictDoUpdate({ target: transactionTypes.id, set: { name: sql`excluded.name` } })

  await db
    .insert(categoryType)
    .values([
      { id: 1, name: 'income' },
      { id: 2, name: 'expense' },
    ])
    .onConflictDoUpdate({ target: categoryType.id, set: { name: sql`excluded.name` } })

  console.log('✅ Transaction statuses seeded')
  console.log('✅ Transaction types seeded')
  console.log('✅ Seeding complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
