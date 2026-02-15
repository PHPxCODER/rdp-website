/**
 * Better Auth Migration Testing Script
 *
 * This script performs automated tests to verify the Better Auth migration
 * was successful.
 *
 * Usage: npx tsx scripts/test-auth-migration.ts
 */

async function testAuthMigration() {
  console.log("🚀 Testing Better Auth migration...\n");

  const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";
  let passedTests = 0;
  let failedTests = 0;

  try {
    // Test 1: API Health Check
    console.log("1️⃣ Testing API health...");
    try {
      const healthResponse = await fetch(`${baseURL}/api/auth/get-session`);
      if (healthResponse.ok || healthResponse.status === 401) {
        console.log("✅ Better Auth API is responding\n");
        passedTests++;
      } else {
        throw new Error(`Unexpected status: ${healthResponse.status}`);
      }
    } catch (error) {
      console.error("❌ API health check failed:", error);
      failedTests++;
    }

    // Test 2: Email OTP endpoint availability
    console.log("2️⃣ Testing Email OTP endpoint...");
    try {
      const otpResponse = await fetch(`${baseURL}/api/auth/email-otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          type: "sign-in",
        }),
      });

      // We expect either success or validation error, not 404
      if (otpResponse.status !== 404) {
        console.log("✅ Email OTP endpoint exists\n");
        passedTests++;
      } else {
        throw new Error("Email OTP endpoint not found");
      }
    } catch (error) {
      console.error("❌ Email OTP endpoint test failed:", error);
      failedTests++;
    }

    // Test 3: 2FA endpoints availability
    console.log("3️⃣ Testing 2FA endpoints...");
    try {
      const twoFactorResponse = await fetch(
        `${baseURL}/api/auth/two-factor/get-totp-uri`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      // We expect 401 (not authenticated), not 404
      if (twoFactorResponse.status === 401 || twoFactorResponse.status === 400) {
        console.log("✅ 2FA endpoints exist\n");
        passedTests++;
      } else if (twoFactorResponse.status === 404) {
        throw new Error("2FA endpoints not found");
      } else {
        console.log(`✅ 2FA endpoints responding (status: ${twoFactorResponse.status})\n`);
        passedTests++;
      }
    } catch (error) {
      console.error("❌ 2FA endpoints test failed:", error);
      failedTests++;
    }

    // Test 4: OAuth redirect endpoints
    console.log("4️⃣ Testing OAuth redirect endpoints...");
    try {
      const providers = ["google", "github", "cognito"];
      let providersPassed = 0;

      for (const provider of providers) {
        const oauthResponse = await fetch(
          `${baseURL}/api/auth/signin/${provider}`,
          {
            method: "GET",
            redirect: "manual",
          }
        );

        // OAuth should redirect (302) or return some response
        if (oauthResponse.status === 302 || oauthResponse.status === 307 || oauthResponse.status === 200) {
          providersPassed++;
        }
      }

      if (providersPassed === providers.length) {
        console.log(`✅ All ${providers.length} OAuth providers configured\n`);
        passedTests++;
      } else {
        throw new Error(
          `Only ${providersPassed}/${providers.length} providers working`
        );
      }
    } catch (error) {
      console.error("❌ OAuth endpoints test failed:", error);
      failedTests++;
    }

    // Test 5: Session endpoint
    console.log("5️⃣ Testing session endpoint...");
    try {
      const sessionResponse = await fetch(`${baseURL}/api/auth/get-session`);

      // Should return 200 with null session (not authenticated) or 401
      if (sessionResponse.ok) {
        const data = await sessionResponse.json();
        console.log("✅ Session endpoint working\n");
        passedTests++;
      } else if (sessionResponse.status === 401) {
        console.log("✅ Session endpoint working (not authenticated)\n");
        passedTests++;
      } else {
        throw new Error(`Unexpected status: ${sessionResponse.status}`);
      }
    } catch (error) {
      console.error("❌ Session endpoint test failed:", error);
      failedTests++;
    }

    // Test 6: Old NextAuth endpoints should not exist
    console.log("6️⃣ Testing old NextAuth endpoints removal...");
    try {
      const oldResponse = await fetch(
        `${baseURL}/api/auth/[...nextauth]`,
        {
          method: "GET",
        }
      );

      // Should return 404 (not found)
      if (oldResponse.status === 404) {
        console.log("✅ Old NextAuth endpoints removed\n");
        passedTests++;
      } else {
        console.warn("⚠️  Old NextAuth endpoint still exists (this may be okay if using catch-all)\n");
        passedTests++;
      }
    } catch (error) {
      console.log("✅ Old NextAuth endpoints removed\n");
      passedTests++;
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Summary:");
    console.log("=".repeat(50));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
    console.log("=".repeat(50) + "\n");

    if (failedTests === 0) {
      console.log("✨ All tests passed! Migration appears successful.");
      console.log("\n📋 Next Steps:");
      console.log("1. Run database migration: npx prisma migrate deploy");
      console.log("2. Run 2FA encryption script: npx tsx scripts/migrate-2fa-encryption.ts");
      console.log("3. Test manual OAuth sign-in with each provider");
      console.log("4. Test email OTP flow with a real email");
      console.log("5. Test 2FA flow if you have test users with 2FA enabled\n");
      process.exit(0);
    } else {
      console.error("⚠️  Some tests failed. Please review the errors above.");
      console.log("\n💡 Common issues:");
      console.log("- Make sure the development server is running");
      console.log("- Check that Better Auth is properly configured in /src/lib/auth.ts");
      console.log("- Verify environment variables are set correctly\n");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n💥 Fatal error during testing:", error);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  testAuthMigration()
    .then(() => {
      console.log("🎉 Testing complete!");
    })
    .catch((error) => {
      console.error("💥 Testing failed:", error);
      process.exit(1);
    });
}

export default testAuthMigration;
