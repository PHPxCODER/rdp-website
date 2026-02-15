import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins/two-factor";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "@/lib/prisma";
import { createTransport } from "nodemailer";
import { html } from "@/lib/emailTemplate";

export const auth = betterAuth({
  appName: "RDP Datacenter",
  baseURL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  secret: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // Enable automatic account linking (like NextAuth's allowDangerousEmailAccountLinking)
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "cognito"],
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // We're using email OTP instead of traditional password-based auth
    // This is mainly for Better Auth compatibility
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET!,
    },
    cognito: {
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      domain: process.env.COGNITO_DOMAIN!,
      region: process.env.COGNITO_REGION!,
      userPoolId: process.env.COGNITO_USERPOOL_ID!,
    },
  },

  plugins: [
    // 2FA Plugin - Replaces custom 2FA implementation
    twoFactor({
      issuer: "RDP Datacenter",
      // Backup codes are automatically encrypted by Better Auth
      backupCodeLength: 8,
      backupCodeCount: 10,
    }),

    // Email OTP Plugin - Replaces NextAuth EmailProvider
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // Configure nodemailer transport
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        // Get host from baseURL
        const { host } = new URL(
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        );

        // Send email using existing template
        await transport.sendMail({
          to: email,
          from: `RDP Datacenter <${process.env.EMAIL_FROM}>`,
          subject: "Sign in to RDP Datacenter",
          html: html({ token: otp, host }),
        });
      },
    }),
  ],

  // Advanced security options
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});

// Export the auth instance type for TypeScript
export type Auth = typeof auth;
