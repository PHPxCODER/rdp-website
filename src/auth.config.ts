import EmailProvider from "next-auth/providers/email";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";
import { createTransport } from "nodemailer";

function CustomPrismaAdapter(p: PrismaClient): Adapter {
  const origin = PrismaAdapter(p);
  return {
    ...origin,
    deleteSession: async (sessionToken: string) => {
      try {
        return await p.session.delete({ where: { sessionToken } });
      } catch (e) {
        console.error("Failed to delete session", e);
        return null;
      }
    },
  } as unknown as Adapter;
}

export const OPTIONS: NextAuthOptions = {
    adapter: CustomPrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      httpOptions: {
        timeout: 30000, // Set this value higher than 3500ms (e.g., 10000ms)
      },
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: `RDP Datacenter <${process.env.EMAIL_FROM}>`,
      maxAge: 3 * 60, // 3 minutes
      async generateVerificationToken() {
        return generateOTP().toString();
      },
      async sendVerificationRequest({
        identifier: email,
        token,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ token, host }),
          html: html({ token, host }),
        });
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.emailVerified = user.emailVerified;
        token.name = user.name;
        token.role = user.role;
        token.phoneNumber = user.phone;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Fetch the latest user data from the database using Prisma
      const user = await prisma.user.findUnique({
        where: { id: token.id },
      });
    
      // If the user exists in the database, update the session object
      if (user) {
        session.user.id = user.id; // Assume user.id is always a string
        session.user.email = user.email ?? ''; // Default to empty string if null
        session.user.emailVerified = user.emailVerified ?? null; // Handle null explicitly
        session.user.name = user.name ?? ''; // Default to empty string if null
        session.user.role = user.role ?? ''; // Default to empty string if null
        session.user.phone = user.phoneNumber ?? ''; // Default to empty string if null
        session.user.createdAt = user.createdAt; // Handle according to your needs
        session.user.updatedAt = user.updatedAt; // Handle according to your needs
        session.user.image = user.image ?? ''; // Default to empty string if null
      }
    
      return session;
    },    
  },
};

function generateOTP() {
  return randomInt(100000, 999999);
}

function html(params: { token: string; host: string }) {
  const { token, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
  };

  return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Sign in to <strong>${escapedHost}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center"><strong>Sign in code:</strong> ${token}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Keep in mind that this code will expire after <strong><em>3 minutes</em></strong>. If you did not request this email you can safely ignore it.
        </td>
      </tr>
    </table>
  </body>
  `;
}

function text(params: { token: string; host: string }) {
  return `
  Sign in to ${params.host}

  Sign in code: ${params.token}

  Keep in mind that this code will expire after 3 minutes. If you did not request this email you can safely ignore it.
  `;
}

export const authOptions = OPTIONS;