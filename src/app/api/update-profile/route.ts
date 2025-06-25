import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUploadUrl } from "@/lib/s3";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(OPTIONS);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("image") as File | null;

    // Ensure the user is updating their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { message: "You can only update your own profile" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!userId || !name) {
      return NextResponse.json(
        { message: "User ID and name are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Handle image upload if a new image was provided
    let finalImageUrl = user.image; // Default to existing image
    
    if (imageFile) {
      try {
        console.log("Preparing to upload file:", imageFile.name, imageFile.type);
        
        // Generate S3 presigned URL for public upload
        const { url, fields, fullUrl } = await generateUploadUrl(
          imageFile.type
        );
        
        console.log("Generated presigned URL:", url);
        console.log("CloudFront URL will be:", fullUrl);

        // Create form data for S3 upload
        const s3FormData = new FormData();
        
        // Important: Add all fields first before the file
        Object.entries(fields).forEach(([key, value]) => {
          s3FormData.append(key, value as string);
          console.log(`Added field: ${key} = ${value}`);
        });
        
        // Append file to form data (must be last)
        s3FormData.append('file', imageFile);
        
        console.log("Sending upload to S3...");

        // Upload to S3 with fetch
        const uploadResponse = await fetch(url, {
          method: "POST",
          body: s3FormData,
        });
        
        console.log("S3 upload response status:", uploadResponse.status);
        
        if (!uploadResponse.ok) {
          console.error("Upload failed with status:", uploadResponse.status);
          const responseText = await uploadResponse.text();
          console.error("Response text:", responseText);
          throw new Error(`Failed to upload image to S3: ${uploadResponse.status} - ${responseText}`);
        }

        console.log("Upload successful! CloudFront URL:", fullUrl);
        
        // Set the CloudFront URL as the final image URL
        finalImageUrl = fullUrl;
      } catch (error) {
        console.error("S3 upload error:", error);
        return NextResponse.json(
          { message: "Failed to upload image: " + (error instanceof Error ? error.message : String(error)) },
          { status: 500 }
        );
      }
    } else if (imageUrl) {
      // Keep the existing image URL if provided
      finalImageUrl = imageUrl;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber: phone,
        image: finalImageUrl, // This will now be a CloudFront URL
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phoneNumber,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}