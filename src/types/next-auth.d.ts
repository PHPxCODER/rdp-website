import 'next-auth'

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    emailVerified: Date | null;
    name: string;
    role: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    // SECURITY: Only include 2FA status in session types
    twoFactorEnabled: boolean;
    // NEVER include these in session types:
    // twoFactorSecret: string | null; // ❌ SECURITY RISK
    // backupCodes: string[]; // ❌ SECURITY RISK
  }

  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: Date | null;
      name: string;
      role: string;
      phone: string;
      createdAt: Date;
      updatedAt: Date;
      image: string | null;
      // SECURITY: Only expose 2FA status, NOT secrets
      twoFactorEnabled: boolean;
      // NEVER include these in session:
      // twoFactorSecret: string | null; // ❌ SECURITY RISK  
      // backupCodes: string[]; // ❌ SECURITY RISK
    };
  }
}

// Extend the JWT interface for token callback
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    emailVerified: Date | null;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    // SECURITY: Only include 2FA status in JWT
    twoFactorEnabled: boolean;
    // NEVER include these in JWT:
    // twoFactorSecret: string | null; // ❌ SECURITY RISK
    // backupCodes: string[]; // ❌ SECURITY RISK
  }
}