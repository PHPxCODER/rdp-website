-- Better Auth Migration
-- This migration transforms the database schema from NextAuth to Better Auth

-- Step 1: Create new TwoFactor table
CREATE TABLE "TwoFactor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactor_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create new Verification table (replaces VerificationToken)
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- Step 3: Migrate 2FA data from User table to TwoFactor table
INSERT INTO "TwoFactor" ("id", "userId", "secret", "backupCodes", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "twoFactorSecret",
    array_to_string("backupCodes", ','),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User"
WHERE "twoFactorEnabled" = true
  AND "twoFactorSecret" IS NOT NULL;

-- Step 4: Update Account table structure
-- Add new columns
ALTER TABLE "Account" ADD COLUMN "id" TEXT;
ALTER TABLE "Account" ADD COLUMN "accountId" TEXT;
ALTER TABLE "Account" ADD COLUMN "providerId" TEXT;
ALTER TABLE "Account" ADD COLUMN "accessToken" TEXT;
ALTER TABLE "Account" ADD COLUMN "refreshToken" TEXT;
ALTER TABLE "Account" ADD COLUMN "idToken" TEXT;
ALTER TABLE "Account" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN "password" TEXT;

-- Populate new columns with data from old columns
UPDATE "Account"
SET
    "id" = gen_random_uuid()::text,
    "accountId" = "providerAccountId",
    "providerId" = "provider",
    "accessToken" = "access_token",
    "refreshToken" = "refresh_token",
    "idToken" = "id_token",
    "expiresAt" = CASE
        WHEN "expires_at" IS NOT NULL THEN to_timestamp("expires_at")
        ELSE NULL
    END;

-- Drop old primary key
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey";

-- Make new columns NOT NULL where needed
ALTER TABLE "Account" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Account" ALTER COLUMN "accountId" SET NOT NULL;
ALTER TABLE "Account" ALTER COLUMN "providerId" SET NOT NULL;

-- Set new primary key
ALTER TABLE "Account" ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- Drop old columns
ALTER TABLE "Account" DROP COLUMN "type";
ALTER TABLE "Account" DROP COLUMN "provider";
ALTER TABLE "Account" DROP COLUMN "providerAccountId";
ALTER TABLE "Account" DROP COLUMN "refresh_token";
ALTER TABLE "Account" DROP COLUMN "access_token";
ALTER TABLE "Account" DROP COLUMN "expires_at";
ALTER TABLE "Account" DROP COLUMN "token_type";
ALTER TABLE "Account" DROP COLUMN "scope";
ALTER TABLE "Account" DROP COLUMN "id_token";
ALTER TABLE "Account" DROP COLUMN "session_state";

-- Step 5: Update Session table structure
-- Add new columns
ALTER TABLE "Session" ADD COLUMN "id" TEXT;
ALTER TABLE "Session" ADD COLUMN "token" TEXT;
ALTER TABLE "Session" ADD COLUMN "expiresAt" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN "ipAddress" TEXT;
ALTER TABLE "Session" ADD COLUMN "userAgent" TEXT;

-- Populate new columns with data from old columns
UPDATE "Session"
SET
    "id" = gen_random_uuid()::text,
    "token" = "sessionToken",
    "expiresAt" = "expires";

-- Make new columns NOT NULL where needed
ALTER TABLE "Session" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "Session" ALTER COLUMN "token" SET NOT NULL;
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET NOT NULL;

-- Drop unique constraint on old column
ALTER TABLE "Session" DROP CONSTRAINT "Session_sessionToken_key";

-- Set new primary key
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- Drop old columns
ALTER TABLE "Session" DROP COLUMN "sessionToken";
ALTER TABLE "Session" DROP COLUMN "expires";

-- Step 6: Update User table
-- Convert emailVerified from DateTime to Boolean
-- Add temporary column
ALTER TABLE "User" ADD COLUMN "emailVerified_new" BOOLEAN DEFAULT false;

-- Set to true if emailVerified was not null (had a date)
UPDATE "User"
SET "emailVerified_new" = ("emailVerified" IS NOT NULL);

-- Drop old column and rename new column
ALTER TABLE "User" DROP COLUMN "emailVerified";
ALTER TABLE "User" RENAME COLUMN "emailVerified_new" TO "emailVerified";

-- Set NOT NULL constraint
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET NOT NULL;

-- Drop 2FA columns that are now in TwoFactor table
ALTER TABLE "User" DROP COLUMN IF EXISTS "twoFactorSecret";
ALTER TABLE "User" DROP COLUMN IF EXISTS "backupCodes";

-- Step 7: Drop old VerificationToken table
DROP TABLE IF EXISTS "VerificationToken";

-- Step 8: Create unique constraints and indexes
CREATE UNIQUE INDEX "TwoFactor_userId_key" ON "TwoFactor"("userId");
CREATE UNIQUE INDEX "Verification_identifier_value_key" ON "Verification"("identifier", "value");
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE UNIQUE INDEX "Account_userId_providerId_key" ON "Account"("userId", "providerId");

-- Step 9: Add foreign key constraint for TwoFactor
ALTER TABLE "TwoFactor" ADD CONSTRAINT "TwoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
