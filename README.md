# Only Students - Learning Management System (LMS)

A modern, full-stack Learning Management System (LMS) built with Next.js 15, tailored for creators and educators to host and sell online courses.

## 🚀 Features & Functionality

### 👨‍🎓 Student Experience
- **Course Browsing & Enrollment**: Students can browse available courses and securely enroll.
- **Video Player & Progress Tracking**: Built-in lesson viewer that tracks lesson completion and overall course progress.
- **Interactive Discussions**: Students can post comments and reply to others on specific lessons.
- **Student Dashboard**: A dedicated dashboard to view enrolled courses, resume learning, and manage billing.

### 👨‍🏫 Instructor / Admin Dashboard
- **Course Creation & Management**: Create courses, set pricing, upload thumbnails, and manage publishing status (Draft/Published/Archived).
- **Curriculum Builder**: Organize content into Chapters and Lessons. Features intuitive **Drag-and-Drop** reordering.
- **Rich Text Editing**: Write detailed course and lesson descriptions using a WYSIWYG editor.
- **Sales & Analytics**: Track student enrollments and revenue/sales data.

### ⚙️ Core Technical Features
- **Authentication**: Secure login/signup via Better Auth (Supports Email/Password & GitHub OAuth).
- **Payments**: Integrated with **Stripe** for processing course purchases and handling webhooks.
- **Media Storage**: Direct integration with **AWS S3** for secure course video and asset storage.
- **Security**: Protected with **Arcjet** for bot detection and rate-limiting.

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Payments**: Stripe
- **Storage**: AWS S3
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), Shadcn UI
- **Animations**: Framer Motion & GSAP
- **Forms**: React Hook Form + Zod
- **Rich Text**: Tiptap
- **Security**: Arcjet

## 📂 Project Structure

- `app/` - Next.js App Router containing all pages and API routes.
  - `admin/` - Admin panel for managing courses, chapters, lessons, students, and sales.
  - `api/` - Backend endpoints for auth, Stripe webhooks, S3 pre-signed URLs, and Arcjet security.
  - `dashboard/` - Student portal to access enrolled courses.
  - `courses/` - Public-facing course catalog and landing pages.
  - `(auth)/` - Authentication pages (login, signup).
- `components/` - Reusable UI components (buttons, dialogs, forms, etc.).
- `lib/` - Utility functions, database client initialization, and auth configurations.
- `prisma/` - Database schema (`schema.prisma`) and migrations.
- `public/` - Static public assets.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Local or Cloud like Supabase/Neon)
- Stripe Account
- AWS Account (for S3 bucket)
- GitHub OAuth application (optional, for GitHub login)

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studix?schema=public"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GITHUB_CLIENT_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-secret"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run postinstall

# Run database migrations
npx prisma migrate dev
```

### Development

Run the development server (uses Turbopack):

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

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/new). Make sure to add all your environment variables in the Vercel dashboard before deploying.

## License

MIT
