/**
 * 2FA Backup Code Re-encryption Script
 *
 * This script migrates backup codes from the old comma-separated format
 * to Better Auth's encrypted format.
 *
 * Run this AFTER the database migration has been applied.
 *
 * Usage: npx tsx scripts/migrate-2fa-encryption.ts
 */

import { PrismaClient } from "@prisma/client";
import { symmetricEncrypt } from "better-auth/crypto";

const prisma = new PrismaClient();

async function migrate2FAEncryption() {
  console.log("🔐 Starting 2FA backup code re-encryption...\n");

  try {
    // Fetch all TwoFactor records
    const twoFactorRecords = await prisma.twoFactor.findMany();

    if (twoFactorRecords.length === 0) {
      console.log("ℹ️  No 2FA records found. Migration complete.");
      return;
    }

    console.log(`📊 Found ${twoFactorRecords.length} 2FA records to migrate.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const record of twoFactorRecords) {
      try {
        // Skip if already encrypted (this is a safety check in case script runs twice)
        if (!record.backupCodes) {
          console.log(`⏭️  Skipping record ${record.id} - no backup codes`);
          continue;
        }

        // Check if already in JSON format (encrypted)
        try {
          JSON.parse(record.backupCodes);
          console.log(`✅ Record ${record.id} already encrypted, skipping`);
          continue;
        } catch {
          // Not JSON, so it's the old comma-separated format
        }

        // Parse old comma-separated format
        const backupCodesArray = record.backupCodes
          .split(",")
          .map((code) => code.trim())
          .filter((code) => code.length > 0);

        console.log(`🔄 Processing record ${record.id}: ${backupCodesArray.length} backup codes`);

        // Encrypt using Better Auth's encryption
        const encryptedData = await symmetricEncrypt({
          key: process.env.NEXTAUTH_SECRET || process.env.BETTER_AUTH_SECRET || "",
          data: JSON.stringify(backupCodesArray),
        });

        // Update the record
        await prisma.twoFactor.update({
          where: { id: record.id },
          data: {
            backupCodes: encryptedData,
            updatedAt: new Date(),
          },
        });

        successCount++;
        console.log(`✅ Successfully encrypted backup codes for record ${record.id}\n`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing record ${record.id}:`, error);
        console.error(`   Backup codes: ${record.backupCodes}\n`);
      }
    }

    console.log("\n📈 Migration Summary:");
    console.log(`   Total records: ${twoFactorRecords.length}`);
    console.log(`   Successfully migrated: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log("\n✨ All 2FA backup codes successfully re-encrypted!");
    } else {
      console.log("\n⚠️  Some records failed to migrate. Please review the errors above.");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Fatal error during migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrate2FAEncryption()
  .then(() => {
    console.log("\n🎉 Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  });
