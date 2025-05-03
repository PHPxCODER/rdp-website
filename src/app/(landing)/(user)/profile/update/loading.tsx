import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@heroui/skeleton";

export default function UpdateProfileLoading() {
  return (
    <div className="relative flex items-center justify-center py-10">
      <GradientBackground />
      <Card className="mx-auto w-full max-w-lg relative z-10 bg-black/10 backdrop-blur border border-white/20">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image Skeleton */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          {/* Form Fields Skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Button Skeletons */}
          <div className="flex justify-end gap-4 pt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}