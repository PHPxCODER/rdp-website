"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CanvasBackground, useThemeAwareDotColor } from "./CanvasBackground";
import { EmailStep } from "./EmailStep";
import { CodeStep } from "./CodeStep";
import { TwoFactorStep } from "./TwoFactorStep";
import { BackupCodeStep } from "./BackupCodeStep";
import { SuccessStep } from "./SuccessStep";
import { useAuthFlow } from "./useAuthFlow";

interface AuthFlowProps {
  className?: string;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ className }) => {
  const dotColor = useThemeAwareDotColor();
  const {
    // State
    email,
    setEmail,
    step,
    code,
    twoFactorCode,
    attemptCount,
    codeInputRefs,
    twoFactorInputRefs,
    initialCanvasVisible,
    reverseCanvasVisible,
    isSubmitting,
    isGoogleLoading,
    setIsGoogleLoading,
    isGithubLoading,
    setIsGithubLoading,
    isCognitoLoading,
    setIsCognitoLoading,
    
    // Handlers
    handleEmailSubmit,
    handleCodeChange,
    handleTwoFactorCodeChange,
    handleOtpSubmit,
    handleTwoFactorSubmit,
    handleBackupCodeSubmit,
    handleKeyDown,
    handleBackClick,
    handleUseBackupCode,
    handleBackToTwoFactor,
    handleOtpPaste,
    handleTwoFactorPaste,
    handleResendCode,
  } = useAuthFlow();

  return (
    <div
      className={cn(
        "flex w-[100%] flex-col min-h-screen bg-background relative",
        className
      )}
    >
      {/* Animated Background */}
      <CanvasBackground
        initialVisible={initialCanvasVisible}
        reverseVisible={reverseCanvasVisible}
        dotColor={dotColor}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {step === "email" && (
                  <EmailStep
                    email={email}
                    setEmail={setEmail}
                    isSubmitting={isSubmitting}
                    isGoogleLoading={isGoogleLoading}
                    isGithubLoading={isGithubLoading}
                    isCognitoLoading={isCognitoLoading}
                    setIsGoogleLoading={setIsGoogleLoading}
                    setIsGithubLoading={setIsGithubLoading}
                    setIsCognitoLoading={setIsCognitoLoading}
                    onEmailSubmit={handleEmailSubmit}
                  />
                )}

                {step === "code" && (
                  <CodeStep
                    code={code}
                    attemptCount={attemptCount}
                    isSubmitting={isSubmitting}
                    codeInputRefs={codeInputRefs}
                    onCodeChange={handleCodeChange}
                    onKeyDown={(index, e) => handleKeyDown(index, e, false)}
                    onOtpPaste={handleOtpPaste}
                    onResendCode={handleResendCode}
                    onBackClick={handleBackClick}
                    onOtpSubmit={handleOtpSubmit}
                  />
                )}

                {step === "twoFactor" && (
                  <TwoFactorStep
                    code={twoFactorCode}
                    isSubmitting={isSubmitting}
                    codeInputRefs={twoFactorInputRefs}
                    onCodeChange={handleTwoFactorCodeChange}
                    onKeyDown={(index, e) => handleKeyDown(index, e, true)}
                    onTwoFactorPaste={handleTwoFactorPaste}
                    onBackClick={handleBackClick}
                    onTwoFactorSubmit={handleTwoFactorSubmit}
                    onUseBackupCode={handleUseBackupCode}
                  />
                )}

                {step === "backupCode" && (
                  <BackupCodeStep
                    isSubmitting={isSubmitting}
                    onBackupCodeSubmit={handleBackupCodeSubmit}
                    onBackToTwoFactor={handleBackToTwoFactor}
                    onBackClick={handleBackClick}
                  />
                )}

                {step === "success" && <SuccessStep />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};