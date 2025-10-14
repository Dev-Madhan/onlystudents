# Studix - Next.js Application

This is a [Next.js](https://nextjs.org) project with authentication, Prisma ORM, and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- GitHub OAuth application (optional, for GitHub login)

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/studix?schema=public"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GITHUB_CLIENT_ID="your-github-client-id"  # Optional
AUTH_GITHUB_SECRET="your-github-secret"          # Optional
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run postinstall

# Run database migrations (if applicable)
npx prisma migrate dev
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deploy on Vercel

### Quick Deploy

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com/new)
3. Add the following environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET` - A secure random string
   - `BETTER_AUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - `AUTH_GITHUB_CLIENT_ID` - GitHub OAuth client ID (optional)
   - `AUTH_GITHUB_SECRET` - GitHub OAuth secret (optional)
4. Deploy!

### Notes for Vercel Deployment

- The build automatically skips environment validation on Vercel (checked via `VERCEL=1` env var)
- Ensure your database is accessible from Vercel (use connection pooling for PostgreSQL)
- Run Prisma migrations after deployment if needed
- ESLint is configured to ignore generated Prisma files

## Tech Stack

- **Framework**: Next.js 15.5.4
- **Authentication**: Better Auth with GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **TypeScript**: Full type safety

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── (auth)/         # Authentication routes
│   ├── api/            # API routes
│   └── page.tsx        # Home page
├── lib/                # Utility functions
│   ├── auth.ts         # Authentication configuration
│   ├── db.ts           # Database client
│   └── env.ts          # Environment variable validation
├── components/         # React components
├── prisma/             # Prisma schema and migrations
└── public/             # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
