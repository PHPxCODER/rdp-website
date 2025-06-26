"use client";

import React from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";

interface OAuthButtonsProps {
  isGoogleLoading: boolean;
  isGithubLoading: boolean;
  isCognitoLoading: boolean;
  setIsGoogleLoading: (loading: boolean) => void;
  setIsGithubLoading: (loading: boolean) => void;
  setIsCognitoLoading: (loading: boolean) => void;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  isGoogleLoading,
  isGithubLoading,
  isCognitoLoading,
  setIsGoogleLoading,
  setIsGithubLoading,
  setIsCognitoLoading,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signIn("google", { callbackUrl: "/dash", redirect: false });
    if (result?.error) {
      toast({
        title: "Google OAuth Error",
        description: "There was an issue signing in with Google. Please try again.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    } else if (result?.url) {
      router.push(result.url);
    }
  };

  // Function to handle Github sign-in
  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    const result = await signIn("github", { callbackUrl: "/dash", redirect: false });
    if (result?.error) {
      toast({
        title: "GitHub OAuth Error",
        description: "There was an issue signing in with GitHub. Please try again.",
        variant: "destructive",
      });
      setIsGithubLoading(false);
    } else if (result?.url) {
      router.push(result.url);
    }
  };

  // Function to handle AWS Cognito sign-in
  const handleCognitoSignIn = async () => {
    setIsCognitoLoading(true);
    const result = await signIn("cognito", { callbackUrl: "/dash", redirect: false });
    if (result?.error) {
      toast({
        title: "RDP SSO Error",
        description: "There was an issue signing in with RDP SSO. Please try again.",
        variant: "destructive",
      });
      setIsCognitoLoading(false);
    } else if (result?.url) {
      router.push(result.url);
    }
  };

  return (
    <div className="space-y-4">
      <motion.button
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-3 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {!isGoogleLoading && <FcGoogle size={20} />}
        <span>{isGoogleLoading ? "Signing in..." : "Sign in with Google"}</span>
      </motion.button>

      <motion.button
        onClick={handleGithubSignIn}
        disabled={isGithubLoading}
        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-3 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {!isGithubLoading && <FaGithub size={20} />}
        <span>{isGithubLoading ? "Signing in..." : "Sign in with GitHub"}</span>
      </motion.button>

      <motion.button
        onClick={handleCognitoSignIn}
        disabled={isCognitoLoading}
        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-3 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-border rounded-full py-3 px-4 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {!isCognitoLoading && <RiLoginCircleLine size={20} className="text-blue-500" />}
        <span>{isCognitoLoading ? "Signing in..." : "RDP Single Sign-On"}</span>
      </motion.button>
    </div>
  );
};