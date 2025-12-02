// prisma.config.ts
import 'dotenv/config'; // <--- This line is CRITICAL
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // defaults to using the DATABASE_URL environment variable
    url: process.env.DATABASE_URL as string,
  },
});