import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const dev = await prisma.user.upsert({
    where: { email: 'dev@phenex.com' },
    update: {},
    create: {
      email: 'dev@phenex.com',
      name: 'Developer',
      password: hashedPassword,
      role: Role.DEV,
    },
  })

  console.log('Seeded User:', dev.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })