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
  }
}
