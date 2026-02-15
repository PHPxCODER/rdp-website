"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Eye, EyeOff, Shield, ShieldCheck, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import QRCode from "react-qr-code";

interface TwoFactorSettingsProps {
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  onSetupComplete?: (secret: string, backupCodes: string[]) => void;
  onDisable?: () => void;
}

interface SetupData {
  totpURI: string;
  backupCodes: string[];
}

export const TwoFactorSettings: React.FC<TwoFactorSettingsProps> = ({
  isEnabled,
  onToggle,
  onSetupComplete,
  onDisable,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<"password" | "enterPassword" | "setup" | "verify" | "backup">("password");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [currentlyEnabled, setCurrentlyEnabled] = useState(isEnabled);
  const [hasPassword, setHasPassword] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [disabling, setDisabling] = useState(false);
  const { toast } = useToast();

  // Check if user has a password on mount
  useEffect(() => {
    checkUserPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserPassword = async () => {
    setCheckingPassword(true);
    try {
      const response = await fetch("/api/has-password");
      const data = await response.json();
      setHasPassword(data.hasPassword);
    } catch (error) {
      console.error("Error checking password:", error);
      toast({
        title: "Error",
        description: "Failed to check password status",
        variant: "destructive",
      });
    } finally {
      setCheckingPassword(false);
    }
  };

  const handleCreatePassword = async () => {
    if (password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      // Update state
      setHasPassword(true);
      setUserPassword(password);
      const pwd = password;
      setPassword("");
      setConfirmPassword("");

      // Re-check password status to ensure UI is in sync
      await checkUserPassword();

      toast({
        title: data.alreadyExists ? "Password Already Set" : "Password Created",
        description: "You can now enable two-factor authentication.",
        variant: "default",
      });

      // Proceed to 2FA setup
      handleEnable2FA(pwd);
    } catch (error) {
      console.error("Error creating password:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterPassword = async () => {
    if (!userPassword || userPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    if (disabling) {
      // User is trying to disable 2FA
      await handleDisable2FA();
    } else {
      // User is trying to enable 2FA
      await handleEnable2FA(userPassword);
    }
  };

  const handleEnable2FA = async (pwd?: string) => {
    // First check if user has a password
    if (!hasPassword && !pwd) {
      // User doesn't have a password, show password creation step
      setSetupStep("password");
      setIsDialogOpen(true);
      return;
    }

    const passwordToUse = pwd || userPassword;

    // If still no password, show enter password dialog
    if (!passwordToUse) {
      setDisabling(false);
      setSetupStep("enterPassword");
      setIsDialogOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // Enable 2FA using Better Auth
      const { data, error } = await authClient.twoFactor.enable({
        password: passwordToUse,
      });

      if (error || !data) {
        throw new Error(error?.message || "Failed to enable 2FA");
      }

      setSetupData({
        totpURI: data.totpURI,
        backupCodes: data.backupCodes,
      });
      setSetupStep("setup");
      setUserPassword("");
    } catch (error) {
      console.error("2FA setup error:", error);

      // Clear the password field so user can try again
      setUserPassword("");

      // Keep the dialog open and show error
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to initialize 2FA setup. Please try again.",
        variant: "destructive",
      });

      // Go back to enterPassword step if we're past it
      if (setupStep !== "enterPassword" && setupStep !== "password") {
        setSetupStep("enterPassword");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) return;

    setIsLoading(true);

    try {
      // Verify TOTP using Better Auth
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
        trustDevice: true,
      });

      if (error || !data) {
        throw new Error(error?.message || "Invalid verification code");
      }

      // After successful verification, 2FA is enabled
      setCurrentlyEnabled(true);
      setSetupStep("backup");
      toast({
        title: "2FA Enabled Successfully",
        description: "Your authenticator app has been verified.",
        variant: "default",
      });

      // Call parent callback
      if (setupData) {
        onSetupComplete?.("", setupData.backupCodes);
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete2FASetup = () => {
    // Close dialog
    setIsDialogOpen(false);
    setSetupStep(hasPassword ? "setup" : "password");
    setVerificationCode("");
    setSetupData(null);
    setUserPassword("");

    toast({
      title: "Setup Complete",
      description: "Two-factor authentication is now protecting your account.",
      variant: "default",
    });
  };

  const handleDisable2FA = async () => {
    if (!userPassword) {
      toast({
        title: "Password Required",
        description: "Please enter your password to disable 2FA.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Disable 2FA using Better Auth
      const { error } = await authClient.twoFactor.disable({
        password: userPassword,
      });

      if (error) {
        throw new Error(error.message || "Failed to disable 2FA");
      }

      // Update local state
      setCurrentlyEnabled(false);
      setUserPassword("");
      setIsDialogOpen(false);

      // Call the parent callback
      onDisable?.();

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account.",
        variant: "default",
      });
    } catch (error) {
      console.error("2FA disable error:", error);

      // Clear the password field so user can try again
      setUserPassword("");

      // Keep dialog open with error message
      toast({
        title: "Failed to Disable",
        description: error instanceof Error ? error.message : "Could not disable 2FA. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
      variant: "default",
    });
  };

  const downloadBackupCodes = () => {
    if (!setupData) return;

    const content = `RDP Datacenter - Backup Codes\n\nSave these backup codes in a safe place. Each code can only be used once.\n\n${setupData.backupCodes.join('\n')}\n\nGenerated: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rdp-datacenter-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleChange = async (checked: boolean) => {
    onToggle?.(checked);

    if (checked) {
      // Re-check password status to ensure it's current
      await checkUserPassword();

      // Check if user has password before enabling
      if (!hasPassword) {
        // User needs to create a password first
        setSetupStep("password");
        setIsDialogOpen(true);
      } else {
        // User already has password, proceed to 2FA setup
        handleEnable2FA();
      }
    } else {
      // Show password dialog before disabling
      setDisabling(true);
      setSetupStep("enterPassword");
      setUserPassword("");
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          {currentlyEnabled ? (
            <ShieldCheck className="w-5 h-5 text-green-500" />
          ) : (
            <Shield className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              {!hasPassword && !checkingPassword
                ? "Requires password setup before enabling"
                : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasPassword && !checkingPassword && (
            <Badge variant="secondary" className="text-amber-600 bg-amber-50 dark:bg-amber-950">
              <Lock className="w-3 h-3 mr-1" />
              Password Required
            </Badge>
          )}
          {currentlyEnabled && (
            <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950">
              Enabled
            </Badge>
          )}
          <Switch
            checked={currentlyEnabled}
            onCheckedChange={handleToggleChange}
            disabled={isLoading || checkingPassword}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setupStep === "password" && "Create a Password"}
              {setupStep === "enterPassword" && (disabling ? "Disable Two-Factor Authentication" : "Enter Your Password")}
              {setupStep === "setup" && "Setup Two-Factor Authentication"}
              {setupStep === "verify" && "Verify Your Setup"}
              {setupStep === "backup" && "Save Your Backup Codes"}
            </DialogTitle>
            <DialogDescription>
              {setupStep === "password" && "You need a password to enable two-factor authentication"}
              {setupStep === "enterPassword" && (disabling ? "Enter your password to disable 2FA" : "Enter your password to continue")}
              {setupStep === "setup" && "Scan the QR code with your authenticator app"}
              {setupStep === "verify" && "Enter the 6-digit code from your authenticator app"}
              {setupStep === "backup" && "Store these backup codes in a safe place"}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {setupStep === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    minLength={8}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    minLength={8}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Why do I need a password?</strong><br />
                    Two-factor authentication requires a password for security. You signed in with OAuth, so we need to create one for you.
                  </p>
                </div>

                <Button
                  onClick={handleCreatePassword}
                  disabled={isLoading || password.length < 8 || password !== confirmPassword}
                  className="w-full"
                >
                  {isLoading ? "Creating..." : "Create Password & Continue"}
                </Button>
              </motion.div>
            )}

            {setupStep === "enterPassword" && (
              <motion.div
                key="enterPassword"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && userPassword.length >= 8) {
                        handleEnterPassword();
                      }
                    }}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setUserPassword("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEnterPassword}
                    disabled={isLoading || userPassword.length < 8}
                    className="flex-1"
                  >
                    {isLoading ? "Processing..." : "Continue"}
                  </Button>
                </div>
              </motion.div>
            )}

            {setupStep === "setup" && setupData && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
                  <QRCode
                    value={setupData.totpURI}
                    size={196}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    style={{ height: "auto", maxWidth: "100%", width: "196px" }}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Scan this QR code with an authenticator app like Google Authenticator, Authy, or 1Password.
                  </p>
                </div>

                <Button
                  onClick={() => setSetupStep("verify")}
                  className="w-full"
                >
                  I&apos;ve Scanned the QR Code
                </Button>
              </motion.div>
            )}

            {setupStep === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-lg font-mono tracking-wider px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSetupStep("setup")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerify2FA}
                    disabled={verificationCode.length !== 6 || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </motion.div>
            )}

            {setupStep === "backup" && setupData && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        Important: Save these backup codes
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                        Use these codes to access your account if you lose your authenticator device. Each code can only be used once.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Your Backup Codes</label>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowBackupCodes(!showBackupCodes)}
                      >
                        {showBackupCodes ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={downloadBackupCodes}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                    {setupData.backupCodes.map((code, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <code className="text-xs font-mono">
                          {showBackupCodes ? code : '••••••••'}
                        </code>
                        {showBackupCodes && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                      Setup Complete!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300">
                      Two-factor authentication is ready to protect your account.
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleComplete2FASetup}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Finishing Setup..." : "Complete Setup"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};