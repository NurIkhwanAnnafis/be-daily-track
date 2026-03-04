import 'dotenv/config'
import { db } from '.'
import { transactionStatus } from './schema'

async function seed() {
  console.log('🌱 Seeding database...')

  // ─── Transaction Status ──────────────────────────────────────────────────
  await db
    .insert(transactionStatus)
    .values([
      { id: 0, name: 'pending' },
      { id: 1, name: 'created' },
      { id: 2, name: 'cancelled' },
    ])
    .onConflictDoNothing()

  console.log('✅ Transaction statuses seeded')
  console.log('✅ Seeding complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
