"use client";

import React, { useState } from "react";
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
import { Copy, Download, Eye, EyeOff, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@heroui/skeleton";

interface TwoFactorSettingsProps {
  isEnabled: boolean;
  onToggle?: (enabled: boolean) => void;
  onSetupComplete?: (secret: string, backupCodes: string[]) => void;
  onDisable?: () => void;
}

interface SetupData {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export const TwoFactorSettings: React.FC<TwoFactorSettingsProps> = ({
  isEnabled,
  onToggle,
  onSetupComplete,
  onDisable,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState<"setup" | "verify" | "backup">("setup");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [currentlyEnabled, setCurrentlyEnabled] = useState(isEnabled);
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const { toast } = useToast();

  const handleEnable2FA = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to setup 2FA");
      }

      const data = await response.json();
      setSetupData(data);
      setSetupStep("setup");
      setQrCodeLoaded(false); // Reset QR code loading state
      setIsDialogOpen(true);
    } catch (error) {
      console.error("2FA setup error:", error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to initialize 2FA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || !setupData) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: setupData.secret,
          token: verificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      setSetupStep("backup");
      toast({
        title: "Verification Successful",
        description: "Your authenticator app has been verified successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("2FA verification error:", error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete2FASetup = async () => {
    if (!setupData) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: setupData.secret,
          backupCodes: setupData.backupCodes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enable 2FA");
      }

      // Update local state
      setCurrentlyEnabled(true);
      setIsDialogOpen(false);
      setSetupStep("setup");
      setVerificationCode("");
      setSetupData(null);
      
      // Call the parent callback
      onSetupComplete?.(setupData.secret, setupData.backupCodes);
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
        variant: "default",
      });
    } catch (error) {
      console.error("2FA enable error:", error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to complete 2FA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to disable 2FA");
      }

      // Update local state
      setCurrentlyEnabled(false);
      
      // Call the parent callback
      onDisable?.();
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled for your account.",
        variant: "default",
      });
    } catch (error) {
      console.error("2FA disable error:", error);
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

  const handleToggleChange = (checked: boolean) => {
    onToggle?.(checked);
    
    if (checked) {
      handleEnable2FA();
    } else {
      handleDisable2FA();
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
              Add an extra layer of security to your account
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentlyEnabled && (
            <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950">
              Enabled
            </Badge>
          )}
          <Switch
            checked={currentlyEnabled}
            onCheckedChange={handleToggleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setupStep === "setup" && "Setup Two-Factor Authentication"}
              {setupStep === "verify" && "Verify Your Setup"}
              {setupStep === "backup" && "Save Your Backup Codes"}
            </DialogTitle>
            <DialogDescription>
              {setupStep === "setup" && "Scan the QR code with your authenticator app"}
              {setupStep === "verify" && "Enter the 6-digit code from your authenticator app"}
              {setupStep === "backup" && "Store these backup codes in a safe place"}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {setupStep === "setup" && setupData && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-center p-4 bg-white rounded-lg relative">
                  {!qrCodeLoaded && (
                    <Skeleton className="w-48 h-48 rounded-lg" />
                  )}
                  <Image 
                    src={setupData.qrCodeUrl} 
                    alt="2FA QR Code" 
                    width={192}
                    height={192}
                    className={`transition-opacity duration-200 ${qrCodeLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setQrCodeLoaded(true)}
                    onError={() => {
                      setQrCodeLoaded(true);
                      toast({
                        title: "QR Code Error",
                        description: "Failed to load QR code. Please use the manual entry key below.",
                        variant: "destructive",
                      });
                    }}
                    priority
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Can&apos;t scan the QR code?</p>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <code className="text-xs flex-1 break-all">
                      {setupData.manualEntryKey}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(setupData.manualEntryKey)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => setSetupStep("verify")} 
                  className="w-full"
                >
                  Continue
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