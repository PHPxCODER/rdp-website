"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export type AuthStep = "email" | "password" | "code" | "twoFactor" | "backupCode" | "success";

export const useAuthFlow = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [passwordAttemptCount, setPasswordAttemptCount] = useState(0);
  const [otpAttemptCount, setOtpAttemptCount] = useState(0);
  const [userHas2FA, setUserHas2FA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const twoFactorInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true); // Default to true for better UX
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isCognitoLoading, setIsCognitoLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // ✅ NEW: Reset 2FA input and focus first input
  const resetTwoFactorInput = () => {
    setTwoFactorCode(["", "", "", "", "", ""]);
    setTimeout(() => {
      twoFactorInputRefs.current[0]?.focus();
    }, 50); // Small delay to ensure state update completes
  };

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

      // Set user 2FA status for reference
      setUserHas2FA(data.twoFactorEnabled);
      setUserId(data.userId);

      // If user has 2FA enabled, use password + TOTP flow
      if (data.twoFactorEnabled) {
        setStep("password");
        toast({
          title: "Password Required",
          description: "Please enter your password to continue.",
          variant: "default",
        });
      } else {
        // No 2FA, use email OTP flow
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });

        if (error) {
          toast({
            title: "Error",
            description: `Failed to send OTP: ${error.message}`,
            variant: "destructive",
          });
        } else {
          setStep("code");
          toast({
            title: "OTP Sent",
            description: "An OTP has been sent to your email. Please check your inbox.",
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordAttemptCount >= 3) {
      toast({
        title: "Too Many Attempts",
        description: "You have exceeded the maximum number of attempts. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Sign in with email + password
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setPasswordAttemptCount((prev) => prev + 1);
        toast({
          title: "Error",
          description: error.message || "Invalid password. Please try again.",
          variant: "destructive",
        });
        setPassword("");
        setIsSubmitting(false);
        return;
      }

      // Check if 2FA redirect is needed
      if (data && 'twoFactorRedirect' in data && data.twoFactorRedirect) {
        console.log("2FA redirect detected, moving to twoFactor step");

        // User has 2FA enabled, show TOTP step
        setPassword(""); // Clear password for security
        setStep("twoFactor");

        toast({
          title: "2FA Required",
          description: "Please enter your authenticator code.",
          variant: "default",
        });
        setIsSubmitting(false);
      } else if (data) {
        // Successfully signed in without 2FA
        setTimeout(() => {
          setStep("success");
          toast({
            title: "Login Successful",
            description: "You have successfully logged in.",
            variant: "default",
          });
          setTimeout(() => {
            router.push("/dash");
            setIsSubmitting(false);
          }, 2000);
        }, 500);
      }
    } catch (error) {
      console.error("Password submit error:", error);
      setPasswordAttemptCount((prev) => prev + 1);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setPassword("");
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (otpCode: string) => {
    if (otpAttemptCount >= 3) {
      toast({
        title: "Maximum Attempts Reached",
        description: "You have exceeded the maximum number of OTP attempts.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.signIn.emailOtp(
        {
          email,
          otp: otpCode,
        },
        {
          onSuccess: (ctx) => {
            // Trigger reverse animation on success
            setReverseCanvasVisible(true);
            setTimeout(() => {
              setInitialCanvasVisible(false);
            }, 50);

            // Check if 2FA is required
            if (ctx.data.twoFactorRedirect) {
              // User has 2FA enabled, redirect to 2FA step
              setStep("twoFactor");
              toast({
                title: "2FA Required",
                description: "Please enter your authenticator code.",
                variant: "default",
              });
              // Reset animations for 2FA step
              setReverseCanvasVisible(false);
              setInitialCanvasVisible(true);
              setIsSubmitting(false);
            } else {
              // No 2FA, proceed to success
              setTimeout(() => {
                setStep("success");
                toast({
                  title: "Login Successful",
                  description: "You have successfully logged in.",
                  variant: "default",
                });
                setTimeout(() => {
                  router.push("/dash");
                  setIsSubmitting(false);
                }, 2000);
              }, 2000);
            }
          },
          onError: () => {
            setOtpAttemptCount((prev) => prev + 1);
            toast({
              title: "Error",
              description: `Invalid OTP. Attempts left: ${3 - otpAttemptCount - 1}`,
              variant: "destructive",
            });
            // Reset animations on error
            setReverseCanvasVisible(false);
            setInitialCanvasVisible(true);
            setCode(["", "", "", "", "", ""]);
            setIsSubmitting(false);
          },
        }
      );
    } catch {
      setOtpAttemptCount((prev) => prev + 1);
      toast({
        title: "Error",
        description: `Invalid OTP. Attempts left: ${3 - otpAttemptCount - 1}`,
        variant: "destructive",
      });
      // Reset animations on error
      setReverseCanvasVisible(false);
      setInitialCanvasVisible(true);
      setCode(["", "", "", "", "", ""]);
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED: Enhanced 2FA submit with auto-reset on error
  const handleTwoFactorSubmit = async (totpCode: string) => {
    setIsSubmitting(true);

    try {
      // Use Better Auth's 2FA verification
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: totpCode,
        trustDevice: trustDevice,
      });

      if (data && !error) {
        // ✅ SUCCESS: Trigger animations and redirect
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
            setIsSubmitting(false);
          }, 2000);
        }, 2000);
      } else {
        // ✅ ERROR: Reset input and focus first field
        resetTwoFactorInput();

        toast({
          title: "Invalid Code",
          description: "The code you entered is invalid. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);

      // ✅ NETWORK ERROR: Also reset input
      resetTwoFactorInput();

      toast({
        title: "Error",
        description: "An error occurred while verifying your code.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED: Enhanced backup code submit with auto-reset on error
  const handleBackupCodeSubmit = async (backupCode: string) => {
    setIsSubmitting(true);

    try {
      // Use Better Auth's backup code verification
      const { data, error } = await authClient.twoFactor.verifyBackupCode({
        code: backupCode,
      });

      if (data && !error) {
        // ✅ SUCCESS: Trigger animations and redirect
        setReverseCanvasVisible(true);
        setTimeout(() => {
          setInitialCanvasVisible(false);
        }, 50);

        setTimeout(() => {
          setStep("success");
          toast({
            title: "Backup Code Verified",
            description: "Login successful.",
            variant: "default",
          });
          setTimeout(() => {
            // Force a hard redirect to ensure session is picked up
            window.location.href = "/dash";
            setIsSubmitting(false);
          }, 2000);
        }, 2000);
      } else {
        // ✅ ERROR: Show error (backup code input handles its own reset)
        toast({
          title: "Invalid Backup Code",
          description: "The backup code you entered is invalid or has already been used.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error verifying backup code:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying your backup code.",
        variant: "destructive",
      });
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
    setPasswordAttemptCount(0);
    setOtpAttemptCount(0);
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
    // ✅ Reset 2FA input when returning from backup code
    resetTwoFactorInput();
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
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast({
          title: "Error",
          description: `Failed to resend OTP: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
          variant: "default",
        });
        setCode(["", "", "", "", "", ""]);
        setOtpAttemptCount(0);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to resend OTP. Please try again. ${error}`,
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
    password,
    setPassword,
    step,
    code,
    twoFactorCode,
    otpAttemptCount,
    passwordAttemptCount,
    userHas2FA,
    userId,
    codeInputRefs,
    twoFactorInputRefs,
    initialCanvasVisible,
    reverseCanvasVisible,
    isSubmitting,
    trustDevice,
    setTrustDevice,
    isGoogleLoading,
    setIsGoogleLoading,
    isGithubLoading,
    setIsGithubLoading,
    isCognitoLoading,
    setIsCognitoLoading,

    // Handlers
    handleEmailSubmit,
    handlePasswordSubmit,
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

    // ✅ NEW: Reset function (can be used by components if needed)
    resetTwoFactorInput,
  };
};