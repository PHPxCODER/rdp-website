import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { cn } from "@/lib/utils";

export default function TeamMemberLoading() {
  return (
    <div className="relative min-h-screen py-12 px-6">
      <GradientBackground />
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/team">
          <Button 
            variant="light" 
            className="mb-6 flex items-center gap-2"
            startContent={<ArrowLeftIcon size={16} />}
          >
            Back to Team
          </Button>
        </Link>

        <Card className={cn(
          "p-8 rounded-lg backdrop-blur-md border mb-8",
          "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
        )}>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
            
            <div className="text-center md:text-left">
              <Skeleton className="h-8 w-48 mb-2 rounded-full" />
              <Skeleton className="h-6 w-32 mb-4 rounded-full" />
              
              <div className="flex gap-3 justify-center md:justify-start mb-4">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="w-9 h-9 rounded-full" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={cn(
            "p-6 rounded-lg backdrop-blur-md border col-span-1 md:col-span-3",
            "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
          )}>
            <Skeleton className="h-7 w-32 mb-4" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-4/5" />
          </Card>

          <Card className={cn(
            "p-6 rounded-lg backdrop-blur-md border",
            "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
          )}>
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </Card>

          <Card className={cn(
            "p-6 rounded-lg backdrop-blur-md border",
            "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
          )}>
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </Card>

          <Card className={cn(
            "p-6 rounded-lg backdrop-blur-md border",
            "bg-white/30 border-white/20 dark:bg-black/30 dark:border-black/20"
          )}>
            <Skeleton className="h-7 w-28 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}