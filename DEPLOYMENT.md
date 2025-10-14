# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- PostgreSQL database (e.g., Neon, Supabase, Railway, or Vercel Postgres)
- GitHub repository with your code

### Step-by-Step Deployment

1. **Prepare Your Database**
   - Create a PostgreSQL database
   - Get the connection string (should look like: `postgresql://user:password@host:5432/database`)
   - Run migrations if needed:
     ```bash
     npx prisma migrate deploy
     ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

4. **Configure Environment Variables in Vercel**

   Required variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=https://your-app.vercel.app
   ```

   Optional (for GitHub OAuth):
   ```
   AUTH_GITHUB_CLIENT_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-secret
   ```

   To set these:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable
   - Redeploy if needed

5. **Run Post-Deployment Tasks**
   - If you have migrations, run them in Vercel's terminal or locally:
     ```bash
     DATABASE_URL="your-production-url" npx prisma migrate deploy
     ```

### Automatic Build Configuration

The project is pre-configured to work with Vercel:
- ✅ ESLint ignores generated Prisma files
- ✅ Environment validation is automatically skipped on Vercel
- ✅ TypeScript compilation is optimized
- ✅ Build output is optimized for serverless

### Troubleshooting

#### Build Fails with "Invalid environment variables"
- Ensure all required environment variables are set in Vercel dashboard
- The `VERCEL=1` environment variable is automatically set by Vercel and allows the build to proceed

#### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- For Vercel Postgres, use the connection pooling URL
- Ensure your database allows connections from Vercel's IP addresses

#### Build Succeeds but Runtime Errors
- Check the Vercel Function Logs in the dashboard
- Verify all environment variables are correctly set
- Ensure database migrations have been run

## Other Platforms

### Railway

1. Create a new project on Railway
2. Add a PostgreSQL database
3. Connect your GitHub repository
4. Set environment variables (same as Vercel)
5. Add build command: `npm run build`
6. Add start command: `npm start`
7. Set `SKIP_ENV_VALIDATION=1` in environment variables

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV SKIP_ENV_VALIDATION=1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Environment Variable Security

- Never commit `.env` or `.env.local` files to version control
- Use `.env.example` as a template
- Rotate secrets regularly
- Use different secrets for development and production

### Database Considerations

For production PostgreSQL:
- Use connection pooling (e.g., PgBouncer)
- Set appropriate connection limits
- Enable SSL if available
- Regular backups
- Monitor query performance

### Monitoring and Logging

- Use Vercel Analytics for performance monitoring
- Check Vercel Function Logs for errors
- Set up error tracking (e.g., Sentry) if needed
- Monitor database performance

## Post-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Database migrations have been run
- [ ] Application loads without errors
- [ ] Authentication works correctly
- [ ] Database connections are stable
- [ ] SSL is enabled (HTTPS)
- [ ] Error monitoring is configured
- [ ] Backups are configured

## Support

For issues specific to:
- Vercel: Check [Vercel Documentation](https://vercel.com/docs)
- Next.js: Check [Next.js Documentation](https://nextjs.org/docs)
- Prisma: Check [Prisma Documentation](https://www.prisma.io/docs)
- Better Auth: Check [Better Auth Documentation](https://www.better-auth.com/docs)
