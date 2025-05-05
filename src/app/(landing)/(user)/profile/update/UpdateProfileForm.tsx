"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GradientBackground } from "@/components/ui/GradientBackground";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { transformS3Url } from "@/lib/image-utils";

// Define form schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  phone: z
    .string()
    .max(15, "Phone number must be less than 15 characters")
    .optional(),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateProfileFormProps {
  initialData: {
    name: string;
    phone: string;
    image: string;
  };
  userId: string;
}

const UpdateProfileForm = ({ initialData, userId }: UpdateProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Transform initial image URL if it's from S3
  const transformedInitialImage = useMemo(() => {
    return transformS3Url(initialData.image);
  }, [initialData.image]);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    transformedInitialImage || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      phone: initialData.phone,
    },
  });

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WEBP or GIF file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Set file for upload
    setImageFile(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Create form data for file upload
      const formData = new FormData();

      // Add form fields
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      formData.append("userId", userId);

      // If there's a new image file, add it
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (initialData.image) {
        // Keep existing image if no new one was uploaded
        formData.append("imageUrl", initialData.image);
      }

      // Send the update request
      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      // Update the cache and revalidate the current route
      router.refresh();

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dash");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center py-10">
      <GradientBackground />
      <Card className="mx-auto w-full max-w-lg relative z-10 bg-black/10 backdrop-blur border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl">Update Your Profile</CardTitle>
          <CardDescription>
            Change your profile details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-white/20">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-700 flex items-center justify-center text-white">
                      <span className="text-3xl">
                        {initialData.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    id="profileImage"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("profileImage")?.click()}
                  >
                    Upload Image
                  </Button>
                </div>
              </div>

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit and Cancel Buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/dash")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm">
            <Link href="/dash" className="text-primary hover:underline">
              Return to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfileForm;