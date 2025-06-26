"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TwoFactorStepProps {
  code: string[];
  isSubmitting: boolean;
  codeInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onCodeChange: (index: number, value: string) => void;
  onKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  onTwoFactorPaste: (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => void;
  onBackClick: () => void;
  onTwoFactorSubmit: (code: string) => void;
  onUseBackupCode: () => void;
}

export const TwoFactorStep: React.FC<TwoFactorStepProps> = ({
  code,
  isSubmitting,
  codeInputRefs,
  onCodeChange,
  onKeyDown,
  onTwoFactorPaste,
  onBackClick,
  onTwoFactorSubmit,
  onUseBackupCode,
}) => {
  return (
    <motion.div
      key="two-factor-step"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      <div className="space-y-1">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
          Two-Factor Authentication
        </h1>
        <p className="text-[1.25rem] text-muted-foreground font-light">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="w-full">
        <div className="relative rounded-full py-4 px-5 border border-border bg-transparent">
          <div className="flex items-center justify-center">
            {code.map((digit, i) => (
              <div key={i} className="flex items-center">
                <div className="relative">
                  <input
                    ref={(el) => {
                      codeInputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onCodeChange(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={(e) =>
                      onTwoFactorPaste(e, (value) => {
                        const digits = value.split("").slice(0, 6);
                        digits.forEach((d, idx) => {
                          if (idx < 6) onCodeChange(idx, d);
                        });
                        if (digits.length === 6) {
                          onTwoFactorSubmit(digits.join(""));
                        }
                      })
                    }
                    className="
                      w-8 text-center text-xl bg-transparent text-foreground
                      border-b-2 border-border
                      focus:border-blue-500 focus:outline-none
                      transition-colors
                    "
                    style={{ caretColor: "black" }}
                  />
                  {!digit && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <span className="text-xl text-muted-foreground">0</span>
                    </div>
                  )}
                </div>
                {i < 5 && (
                  <span className="text-muted-foreground text-xl">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              Open your authenticator app
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Find the 6-digit code for RDP Datacenter and enter it above
            </p>
          </div>
        </div>
      </div>

      {/* Backup code option */}
      <div>
        <motion.button
          onClick={onUseBackupCode}
          disabled={isSubmitting}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          Use backup code instead
        </motion.button>
      </div>

      <div className="flex w-full gap-3">
        <motion.button
          onClick={onBackClick}
          className="rounded-full bg-foreground text-background font-medium px-8 py-3 hover:bg-foreground/90 transition-colors w-[30%]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={() => {
            const completeCode = code.join("");
            if (completeCode.length === 6) {
              onTwoFactorSubmit(completeCode);
            }
          }}
          className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
            code.every((d) => d !== "")
              ? "bg-foreground text-background border-transparent hover:bg-foreground/90 cursor-pointer"
              : "bg-background text-muted-foreground border-border cursor-not-allowed"
          }`}
          disabled={!code.every((d) => d !== "") || isSubmitting}
          whileHover={code.every((d) => d !== "") ? { scale: 1.02 } : {}}
          whileTap={code.every((d) => d !== "") ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </motion.button>
      </div>

      <div className="pt-16">
        <p className="text-xs text-muted-foreground">
          Having trouble? Contact{" "}
          <Link
            href="mailto:support@rdpdatacenter.in"
            className="underline text-muted-foreground hover:text-foreground transition-colors"
          >
            support
          </Link>{" "}
          for assistance.
        </p>
      </div>
    </motion.div>
  );
};