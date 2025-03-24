// src/app/admin/layout.tsx
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Briefcase, Users, LogOut } from "lucide-react";
import { GradientBackground } from "@/components/ui/GradientBackground";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side protection
  useEffect(() => {
    if (mounted && status !== "loading") {
      if (!session) {
        redirect("/auth");
      } else if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
        redirect("/dash");
      }
    }
  }, [session, status, mounted]);

  if (!mounted || status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const navigation = [
    {
      name: "Job Listings",
      href: "/admin/jobs",
      icon: Briefcase,
      current: pathname === "/admin/jobs" || pathname === "/admin",
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: Users,
      current: pathname === "/admin/applications",
    },
  ];

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <GradientBackground />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black/30 border-r border-gray-800 h-full flex flex-col z-10">
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">{session?.user?.role}</p>
            </div>
          </div>
          <nav className="p-4 flex-1">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                      item.current
                        ? "bg-primary/80 text-white"
                        : "text-gray-300 hover:bg-primary/20"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-gray-300 hover:text-white"
              onClick={() => {
                localStorage.removeItem("hasSeenConfetti");
                window.location.href = "/api/auth/signout";
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto z-10 relative">
          <main className="p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}