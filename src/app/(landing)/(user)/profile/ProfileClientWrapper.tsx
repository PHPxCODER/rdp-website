"use client";

import React from "react";
import BlurImage from "@/components/blur-image";
import SignOutButton from "@/components/ui/SignoutButton"; 
import {GradientBackground} from "@/components/ui/GradientBackground";
import GreetingMessage from "@/components/ui/GreetingMessage";
import { ConfettiFireworks } from "@/components/ui/Confetti";
import { Button } from "@/components/ui/button";
import { TwoFactorSettings } from "../../auth/TwoFactorSettings";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Shield, User, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  role: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  twoFactorEnabled: boolean;
}

interface ProfileClientWrapperProps {
  user: User;
}

const ProfileClientWrapper: React.FC<ProfileClientWrapperProps> = ({ user }) => {
  const { toast } = useToast();

  const handleToggle2FA = async (enabled: boolean) => {
    // The actual toggle logic is handled inside TwoFactorSettings component
    // This is just for any additional side effects if needed
    console.log("2FA toggled:", enabled);
    // Optionally: refetch user data here
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSetupComplete = async (backupCodes: string[]) => {
    toast({
      title: "2FA Setup Complete",
      description:
        "Two-factor authentication has been successfully enabled for your account.",
      variant: "default",
    });
    // Optionally: refetch user data here instead of reloading
  };

  const handleDisable2FA = async () => {
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
      variant: "default",
    });
    // Optionally: refetch user data here instead of reloading
  };

  return (
    <div className="relative flex flex-col items-center top-10 justify-center min-h-screen">
      {/* Gradient Background */}
      <ConfettiFireworks />
      <GradientBackground />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="shadow-md rounded-lg backdrop-blur-md p-6">
          <GreetingMessage />
          <h1 className="text-2xl font-semibold mt-2">
            Welcome, {user?.name || "User"}!
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <div className="relative w-20 h-20 overflow-hidden rounded-full">
              <BlurImage
                src={user?.image ?? "/images/avatar.png"}
                alt={user?.name ?? "User Avatar"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-white-600">
                <strong>Role:</strong> {user?.role || "N/A"}
              </p>
              <p className="text-white-600">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p className="text-white-600">
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="shadow-md rounded-lg backdrop-blur-md p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Account Settings</h2>
          </div>

          {/* Profile Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              <h3 className="text-lg font-medium">Profile Information</h3>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Personal Details</p>
                <p className="text-sm text-muted-foreground">
                  Update your name, phone number, and profile picture
                </p>
              </div>
              <Link href="/profile/update">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" />
              <h3 className="text-lg font-medium">Security Settings</h3>
            </div>

            {/* Two-Factor Authentication */}
            <TwoFactorSettings
              isEnabled={user?.twoFactorEnabled || false}
              onToggle={handleToggle2FA}
              onSetupComplete={handleSetupComplete}
              onDisable={handleDisable2FA}
            />
          </div>

          <Separator />

          {/* Session Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Session Management</h3>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="shadow-md rounded-lg backdrop-blur-md p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Account ID:</span>
                <p className="text-muted-foreground font-mono text-xs mt-1">
                  {user?.id}
                </p>
              </div>
              <div>
                <span className="font-medium">Member Since:</span>
                <p className="text-muted-foreground">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email Verified:</span>
                <p className="text-muted-foreground">
                  {user?.emailVerified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Unverified</span>
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Two-Factor Auth:</span>
                <p className="text-muted-foreground">
                  {user?.twoFactorEnabled ? (
                    <span className="text-green-600">✓ Enabled</span>
                  ) : (
                    <span className="text-muted-foreground">✗ Disabled</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClientWrapper;