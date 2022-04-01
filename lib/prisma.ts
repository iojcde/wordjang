import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === `production`) {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}&sslidentity=${process.env.DB_CA}`,
      },
    },
  })
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient()
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
