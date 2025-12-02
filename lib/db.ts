// lib/db.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  // 1. Create a standard PostgreSQL connection pool
  const pool = new Pool({ connectionString });

  // 2. Create the Prisma Adapter using that pool
  const adapter = new PrismaPg(pool);

  // 3. Pass the adapter to PrismaClient
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;