-- Add missing fields to Account table for Better Auth compatibility
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "scope" TEXT;

-- Remove the old expiresAt column if it exists and conflicts
-- (Only run this if you have an expiresAt column that's causing issues)
-- ALTER TABLE "Account" DROP COLUMN IF EXISTS "expiresAt";
