"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BackupCodeStepProps {
  isSubmitting: boolean;
  onBackupCodeSubmit: (code: string) => void;
  onBackToTwoFactor: () => void;
  onBackClick: () => void;
}

export const BackupCodeStep: React.FC<BackupCodeStepProps> = ({
  isSubmitting,
  onBackupCodeSubmit,
  onBackToTwoFactor,
  onBackClick,
}) => {
  const [backupCode, setBackupCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (backupCode.trim()) {
      onBackupCodeSubmit(backupCode.trim());
    }
  };

  const formatBackupCode = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Add space every 4 characters for readability
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBackupCode(e.target.value);
    setBackupCode(formatted);
  };

  return (
    <motion.div
      key="backup-code-step"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      <div className="space-y-1">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
          Backup Code
        </h1>
        <p className="text-[1.25rem] text-muted-foreground font-light">
          Enter one of your backup codes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full">
          <input
            type="text"
            placeholder="XXXX XXXX"
            value={backupCode}
            onChange={handleInputChange}
            maxLength={9} // 8 characters + 1 space
            className="w-full text-center text-2xl font-mono tracking-wider bg-transparent text-foreground border border-border rounded-lg py-4 px-4 focus:outline-none focus:border-foreground/50 focus:ring-0"
            autoFocus
            required
          />
        </div>

        {/* Warning message */}
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                One-time use only
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                Each backup code can only be used once. Make sure you save your remaining codes.
              </p>
            </div>
          </div>
        </div>

        <div>
          <motion.button
            onClick={onBackToTwoFactor}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Use authenticator app instead
          </motion.button>
        </div>

        <div className="flex w-full gap-3">
          <motion.button
            type="button"
            onClick={onBackClick}
            className="rounded-full bg-foreground text-background font-medium px-8 py-3 hover:bg-foreground/90 transition-colors w-[30%]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Back
          </motion.button>
          <motion.button
            type="submit"
            className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
              backupCode.trim()
                ? "bg-foreground text-background border-transparent hover:bg-foreground/90 cursor-pointer"
                : "bg-background text-muted-foreground border-border cursor-not-allowed"
            }`}
            disabled={!backupCode.trim() || isSubmitting}
            whileHover={backupCode.trim() ? { scale: 1.02 } : {}}
            whileTap={backupCode.trim() ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </motion.button>
        </div>
      </form>

      <div className="pt-16">
        <p className="text-xs text-muted-foreground">
          Lost your backup codes? Contact{" "}
          <Link
            href="mailto:support@rdpdatacenter.in"
            className="underline text-muted-foreground hover:text-foreground transition-colors"
          >
            support
          </Link>{" "}
          for account recovery.
        </p>
      </div>
    </motion.div>
  );
};