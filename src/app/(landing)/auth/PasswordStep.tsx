"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";

interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  onPasswordSubmit: (e: React.FormEvent) => void;
  onBackClick: () => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  password,
  setPassword,
  isSubmitting,
  onPasswordSubmit,
  onBackClick,
}) => {
  return (
    <motion.div
      key="password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Enter Password</h1>
        <p className="text-muted-foreground">
          Your account has 2FA enabled. Please enter your password to continue.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            autoFocus
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isSubmitting || !password}
        >
          {isSubmitting ? "Verifying..." : "Continue"}
        </Button>
      </form>

      {/* Back button */}
      <button
        onClick={onBackClick}
        disabled={isSubmitting}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to email
      </button>
    </motion.div>
  );
};
