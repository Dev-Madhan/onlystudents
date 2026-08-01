// prisma.config.ts
import { config } from 'dotenv';
config({ path: '.env.local' }); // <--- Load from .env.local instead of standard .env
import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // defaults to using the DATABASE_URL environment variable
    url: process.env.DATABASE_URL as string,
  },
});