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

  const factory = await prisma.factory.upsert({
    where: { id: 'factory-1' },
    update: {},
    create: {
      id: 'factory-1',
      name: 'Phenex Primary Mfg',
      location: 'Shenzhen, China',
    },
  })

  const product = await prisma.product.upsert({
    where: { sku: 'INF-X8-300' },
    update: {},
    create: {
      name: 'Inferno X8 300m',
      sku: 'INF-X8-300',
      reorderPoint: 15000,
      currentStock: 8000,
    },
  })

  console.log('Seeded User:', dev.email)
  console.log('Seeded Factory:', factory.name)
  console.log('Seeded Product:', product.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })