"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CodeStepProps {
  code: string[];
  attemptCount: number;
  isSubmitting: boolean;
  codeInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onCodeChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>, onChange: (value: string) => void) => void;
  onResendCode: () => void;
  onBackClick: () => void;
  onOtpSubmit: (otpCode: string) => void;
}

export const CodeStep: React.FC<CodeStepProps> = ({
  code,
  attemptCount,
  isSubmitting,
  codeInputRefs,
  onCodeChange,
  onKeyDown,
  onOtpPaste,
  onResendCode,
  onBackClick,
  onOtpSubmit,
}) => {
  return (
    <motion.div
      key="code-step"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      <div className="space-y-1">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
          We sent you a code
        </h1>
        <p className="text-[1.25rem] text-muted-foreground font-light">
          Please enter it below
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
                    onPaste={(e) => onOtpPaste(e, (value) => {
                      const digits = value.split('').slice(0, 6);
                      const newCode = [...code];
                      digits.forEach((d, idx) => {
                        if (idx < 6) newCode[idx] = d;
                      });
                      // Update code through parent component
                      digits.forEach((d, idx) => {
                        if (idx < 6) onCodeChange(idx, d);
                      });
                      if (digits.length === 6) {
                        onOtpSubmit(digits.join(''));
                      }
                    })}
                    className="w-8 text-center text-xl bg-transparent text-foreground border-none focus:outline-none focus:ring-0 appearance-none"
                    style={{ caretColor: "transparent" }}
                  />
                  {!digit && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <span className="text-xl text-muted-foreground">
                        0
                      </span>
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

      <div>
        <motion.button
          onClick={onResendCode}
          disabled={isSubmitting}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {isSubmitting ? "Sending..." : "Resend code"}
        </motion.button>
      </div>

      {attemptCount >= 3 && (
        <div className="text-red-500 text-center text-sm">
          You have exceeded the maximum number of OTP attempts.
        </div>
      )}

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
            const completeCode = code.join('');
            if (completeCode.length === 6) {
              onOtpSubmit(completeCode);
            }
          }}
          className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
            code.every((d) => d !== "") && attemptCount < 3
              ? "bg-foreground text-background border-transparent hover:bg-foreground/90 cursor-pointer"
              : "bg-background text-muted-foreground border-border cursor-not-allowed"
          }`}
          disabled={!code.every((d) => d !== "") || isSubmitting || attemptCount >= 3}
          whileHover={code.every((d) => d !== "") && attemptCount < 3 ? { scale: 1.02 } : {}}
          whileTap={code.every((d) => d !== "") && attemptCount < 3 ? { scale: 0.98 } : {}}
          transition={{ duration: 0.2 }}
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </motion.button>
      </div>

      <div className="pt-16">
        <p className="text-xs text-muted-foreground">
          By signing up, you agree to the{" "}
          <Link
            href="/T%26Cs"
            className="underline text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          ,{" "}
          <Link
            href="/Privacy"
            className="underline text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};