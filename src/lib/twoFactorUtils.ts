import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

/**
 * Generate a new 2FA secret and QR code for user setup
 */
export async function generateTwoFactorSecret(
  userEmail: string,
  userName: string,
  serviceName: string = 'RDP Datacenter'
): Promise<TwoFactorSetup> {
  try {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${serviceName} (${userEmail})`,
      issuer: serviceName,
      length: 32,
    });

    if (!secret.otpauth_url) {
      throw new Error('Failed to generate OTP auth URL');
    }

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    return {
      secret: secret.base32 || '',
      qrCodeUrl,
      manualEntryKey: secret.base32 || '',
      backupCodes,
    };
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    throw new Error('Failed to generate 2FA setup');
  }
}

/**
 * Verify a TOTP token against the user's secret
 */
export function verifyTwoFactorToken(
  token: string,
  secret: string,
  window: number = 2
): boolean {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''), // Remove any spaces
      window, // Allow for time drift
    });
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}

/**
 * Generate backup codes for account recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  
  return codes;
}

/**
 * Verify if a backup code is valid and remove it from the list
 */
export function verifyAndConsumeBackupCode(
  inputCode: string,
  backupCodes: string[]
): { isValid: boolean; remainingCodes: string[] } {
  const normalizedInput = inputCode.replace(/\s/g, '').toUpperCase();
  const codeIndex = backupCodes.findIndex(code => code === normalizedInput);
  
  if (codeIndex === -1) {
    return { isValid: false, remainingCodes: backupCodes };
  }
  
  // Remove the used backup code
  const remainingCodes = backupCodes.filter((_, index) => index !== codeIndex);
  
  return { isValid: true, remainingCodes };
}

/**
 * Generate a temporary bypass token for 2FA setup
 */
export function generateBypassToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Check if 2FA setup is complete
 */
export function isTwoFactorSetupComplete(user: {
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
}): boolean {
  return user.twoFactorEnabled && !!user.twoFactorSecret;
}

/**
 * Format backup codes for display
 */
export function formatBackupCodesForDisplay(codes: string[]): string[] {
  return codes.map(code => {
    // Add spaces every 4 characters for readability
    return code.replace(/(.{4})/g, '$1 ').trim();
  });
}

/**
 * Validate TOTP token format
 */
export function isValidTotpFormat(token: string): boolean {
  const cleaned = token.replace(/\s/g, '');
  return /^\d{6}$/.test(cleaned);
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(otpauthUrl: string): Promise<string> {
  try {
    return await QRCode.toString(otpauthUrl, { type: 'svg' });
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code');
  }
}