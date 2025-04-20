# RDP Datacenter

![Banner](https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg)

## Overview

RDP Datacenter is a modern cloud hosting platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Prisma. The platform provides enterprise-grade cloud hosting solutions with a focus on reliability, security, and performance.

## Features

- **Authentication**: Multiple authentication options including email OTP, Google, GitHub, and RDP Single Sign-On
- **User Management**: Complete user management system with roles and permissions
- **Beautiful UI**: Modern, responsive design with dark/light mode support
- **Legal Pages**: Comprehensive legal documents including Terms & Conditions, Privacy Policy, etc.
- **Team Showcase**: Dynamic team member profiles with Discord integration for real-time status
- **Performance Optimized**: Built with performance in mind using Next.js App Router for faster page loads

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Design System**: Tailwind CSS, shadcn/ui, HeroUI
- **Authentication**: NextAuth.js with multiple providers
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Nodemailer, React Email for templating
- **State Management**: React Context, Hooks
- **Deployment**: Vercel (implied)
- **3D Visualization**: Three.js, React Three Fiber

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- SMTP server for email functionalities

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PHPxCODER/rdp-website.git
   cd rdp-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   Fill in the required environment variables in the `.env` file.

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                # Next.js App Router structure
│   ├── (landing)/      # Public-facing pages (home, auth, team, etc.)
│   ├── api/            # API routes and serverless functions
│   ├── globals.css     # Global CSS styles
│   └── layout.tsx      # Root layout component
├── components/         # Reusable UI components
├── config/             # Configuration files (site, team, SEO, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared code
├── types/              # TypeScript type definitions
└── auth.config.ts      # Authentication configuration
```

## Authentication

RDP Datacenter supports multiple authentication methods:

- **Email OTP**: Secure one-time password sent to user's email
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account
- **RDP Single Sign-On**: Custom SSO solution

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and profile information
- **Account**: OAuth account connections
- **Session**: Authentication sessions
- **JobListing**: Career opportunities
- **JobApplication**: Applications for job listings
- **Subscriber**: Newsletter subscribers

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint to check code quality

## Environment Variables

Key environment variables needed:

```
# NextAuth
NEXTAUTH_URL=            # Base URL of your application
NEXTAUTH_SECRET=         # Secret for NextAuth.js session encryption

# Database
DATABASE_URL=            # PostgreSQL connection string

# Email
EMAIL_SERVER_HOST=       # SMTP server host
EMAIL_SERVER_USER=       # SMTP username
EMAIL_SERVER_PASSWORD=   # SMTP password
EMAIL_FROM=              # Sender email address
REPLY_TO=                # Reply-to email address

# OAuth Providers
AUTH_GOOGLE_ID=          # Google OAuth client ID
AUTH_GOOGLE_SECRET=      # Google OAuth client secret
AUTH_GITHUB_ID=          # GitHub OAuth client ID
AUTH_GITHUB_SECRET=      # GitHub OAuth client secret
AUTH_COGNITO_ID=         # AWS Cognito ID
AUTH_COGNITO_SECRET=     # AWS Cognito Secret
AUTH_COGNITO_ISSUER=     # AWS Cognito Issuer ID

# Services
BETTERSTACK_API_KEY=     # BetterStack monitoring API key
REDIS_URL=               # Redis connection string for rate limiting
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary and not open for public use without permission.

## Contact

For inquiries, please contact:
- **Support**: support@rdpdatacenter.in
- **Business**: noc@rdpdatacenter.in
