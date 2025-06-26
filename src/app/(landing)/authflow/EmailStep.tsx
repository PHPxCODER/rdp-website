"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { OAuthButtons } from "./OAuthButton";

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  isGoogleLoading: boolean;
  isGithubLoading: boolean;
  isCognitoLoading: boolean;
  setIsGoogleLoading: (loading: boolean) => void;
  setIsGithubLoading: (loading: boolean) => void;
  setIsCognitoLoading: (loading: boolean) => void;
  onEmailSubmit: (e: React.FormEvent) => void;
}

export const EmailStep: React.FC<EmailStepProps> = ({
  email,
  setEmail,
  isSubmitting,
  isGoogleLoading,
  isGithubLoading,
  isCognitoLoading,
  setIsGoogleLoading,
  setIsGithubLoading,
  setIsCognitoLoading,
  onEmailSubmit,
}) => {
  return (
    <motion.div
      key="email-step"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 text-center"
    >
      <div className="space-y-1">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-[1.8rem] text-muted-foreground font-light">
          Sign in to continue
        </p>
      </div>

      <div className="space-y-4">
        <OAuthButtons
          isGoogleLoading={isGoogleLoading}
          isGithubLoading={isGithubLoading}
          isCognitoLoading={isCognitoLoading}
          setIsGoogleLoading={setIsGoogleLoading}
          setIsGithubLoading={setIsGithubLoading}
          setIsCognitoLoading={setIsCognitoLoading}
        />

        <div className="flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <span className="text-muted-foreground text-sm">or</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <form onSubmit={onEmailSubmit}>
          <div className="relative">
            <input
              type="email"
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full backdrop-blur-[1px] text-foreground border border-border rounded-full py-3 px-4 focus:outline-none focus:border focus:border-foreground/30 text-center bg-transparent"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-1.5 top-1.5 text-foreground w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors group overflow-hidden disabled:opacity-50"
            >
              <span className="relative w-full h-full block overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                  →
                </span>
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                  →
                </span>
              </span>
            </button>
          </div>
        </form>
      </div>

      <p className="text-xs text-muted-foreground pt-10">
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
    </motion.div>
  );
};