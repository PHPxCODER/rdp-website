"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "code" | "twoFactor" | "backupCode" | "success";

export const useAuthFlow = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [userHas2FA, setUserHas2FA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const twoFactorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isCognitoLoading, setIsCognitoLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check for OAuth errors in URL query params
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      toast({
        title: "OAuth Error",
        description:
          error === "OAuthCallbackError"
            ? "There was an error with the sign-in. Please try again."
            : `An error occurred: ${error}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    } else if (step === "twoFactor") {
      setTimeout(() => {
        twoFactorInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user exists and get 2FA status
      const checkUserResponse = await fetch("/api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (checkUserResponse.status === 429) {
        toast({
          title: "Slow Down",
          description: "You're making too many requests. Please wait a minute.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const data = await checkUserResponse.json();
      if (!data.exists) {
        toast({
          title: "User Not Registered",
          description:
            "The email you entered is not registered. Please sign up first.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Set user 2FA status
      setUserHas2FA(data.twoFactorEnabled);
      setUserId(data.userId);

      if (data.twoFactorEnabled) {
        // If user has 2FA enabled, go directly to 2FA step
        setStep("twoFactor");
        toast({
          title: "2FA Required",
          description: "Please enter the code from your authenticator app.",
          variant: "default",
        });
      } else {
        // Send OTP via NextAuth if no 2FA
        const response = await signIn("email", {
          email,
          redirect: false,
          callbackUrl: "/dash",
        });

        if (response?.error) {
          toast({
            title: "Error",
            description: `Failed to send OTP: ${response.error}`,
            variant: "destructive",
          });
        } else {
          setStep("code");
          toast({
            title: "OTP Sent",
            description:
              "An OTP has been sent to your email. Please check your inbox.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error during email submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          handleOtpSubmit(newCode.join(""));
        }
      }
    }
  };

  const handleTwoFactorCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...twoFactorCode];
      newCode[index] = value;
      setTwoFactorCode(newCode);

      // Focus next input if value is entered
      if (value && index < 5) {
        twoFactorInputRefs.current[index + 1]?.focus();
      }

      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          handleTwoFactorSubmit(newCode.join(""));
        }
      }
    }
  };

  const handleOtpSubmit = async (otpCode: string) => {
    if (attemptCount >= 3) {
      toast({
        title: "Maximum Attempts Reached",
        description: "You have exceeded the maximum number of OTP attempts.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Trigger reverse animation
    setReverseCanvasVisible(true);
    setTimeout(() => {
      setInitialCanvasVisible(false);
    }, 50);

    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(otpCode);
    const formattedCallback = encodeURIComponent("/dash");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;

    const response = await fetch(otpRequestURL, { cache: "no-store" });

    if (response.ok) {
      setTimeout(() => {
        setStep("success");
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          variant: "default",
        });
        setTimeout(() => {
          router.push("/dash");
        }, 2000);
      }, 2000);
    } else {
      setAttemptCount((prev) => prev + 1);
      toast({
        title: "Error",
        description: `Invalid OTP. Attempts left: ${3 - attemptCount - 1}`,
        variant: "destructive",
      });
      // Reset animations on error
      setReverseCanvasVisible(false);
      setInitialCanvasVisible(true);
      setCode(["", "", "", "", "", ""]);
    }

    setIsSubmitting(false);
  };

  const handleTwoFactorSubmit = async (totpCode: string) => {
    setIsSubmitting(true);

    try {
      // Use our custom 2FA callback endpoint that creates proper sessions
      const response = await fetch("/api/callback/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: totpCode,
          isBackupCode: false,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Trigger reverse animation
        setReverseCanvasVisible(true);
        setTimeout(() => {
          setInitialCanvasVisible(false);
        }, 50);

        setTimeout(() => {
          setStep("success");
          toast({
            title: "2FA Verified",
            description: "You have successfully logged in.",
            variant: "default",
          });
          setTimeout(() => {
            // Force a hard redirect to ensure session is picked up
            window.location.href = "/dash";
          }, 2000);
        }, 2000);
      } else {
        toast({
          title: "Invalid Code",
          description: "The code you entered is invalid. Please try again.",
          variant: "destructive",
        });
        setTwoFactorCode(["", "", "", "", "", ""]);
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying your code.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackupCodeSubmit = async (backupCode: string) => {
    setIsSubmitting(true);

    try {
      // Use our custom 2FA callback endpoint
      const response = await fetch("/api/callback/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: backupCode,
          isBackupCode: true,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Trigger reverse animation
        setReverseCanvasVisible(true);
        setTimeout(() => {
          setInitialCanvasVisible(false);
        }, 50);

        setTimeout(() => {
          setStep("success");
          toast({
            title: "Backup Code Verified",
            description: `Login successful. You have ${data.remainingBackupCodes} backup codes remaining.`,
            variant: "default",
          });
          setTimeout(() => {
            // Force a hard redirect to ensure session is picked up
            window.location.href = "/dash";
          }, 2000);
        }, 2000);
      } else {
        toast({
          title: "Invalid Backup Code",
          description: "The backup code you entered is invalid or has already been used.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying backup code:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying your backup code.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    isForTwoFactor: boolean = false
  ) => {
    const targetCode = isForTwoFactor ? twoFactorCode : code;
    const targetRefs = isForTwoFactor ? twoFactorInputRefs : codeInputRefs;
    
    if (e.key === "Backspace" && !targetCode[index] && index > 0) {
      targetRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setTwoFactorCode(["", "", "", "", "", ""]);
    setAttemptCount(0);
    setUserHas2FA(false);
    setUserId(null);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const handleUseBackupCode = () => {
    setStep("backupCode");
  };

  const handleBackToTwoFactor = () => {
    setStep("twoFactor");
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/-/g, "");
    if (pastedText.length === 6) {
      onChange(pastedText);
    }
  };

  const handleTwoFactorPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\s/g, "");
    if (pastedText.length === 6 && /^\d{6}$/.test(pastedText)) {
      onChange(pastedText);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim() || userHas2FA) return;
    
    setIsSubmitting(true);
    try {
      const response = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dash",
      });

      if (response?.error) {
        toast({
          title: "Error",
          description: `Failed to resend OTP: ${response.error}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
          variant: "default",
        });
        setCode(["", "", "", "", "", ""]);
        setAttemptCount(0);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to resend OTP: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    email,
    setEmail,
    step,
    code,
    twoFactorCode,
    attemptCount,
    userHas2FA,
    userId,
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
  };
};