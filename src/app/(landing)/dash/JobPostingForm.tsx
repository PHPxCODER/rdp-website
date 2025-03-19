"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useToast } from "@/hooks/use-toast";

export default function JobPostingForm() {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    department: "",
    location: "",
    description: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        body: new URLSearchParams({
          ...formData,
          requirements: formData.requirements.split(",").join(","),
        }),
      });

      if (response.ok) {
        toast({
          title: "Job Posted Successfully",
          description: "The job has been added to the database.",
          variant: "default",
        });
        router.push("/careers");
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to post the job.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="id"
        placeholder="Job ID"
        value={formData.id}
        onChange={handleChange}
        required
      />
      <Input
        name="title"
        placeholder="Job Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        required
      />
      <Input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <Textarea
        name="description"
        placeholder="Job Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <Textarea
        name="requirements"
        placeholder="Requirements (comma-separated)"
        value={formData.requirements}
        onChange={handleChange}
        required
      />
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Job"}
      </Button>
    </form>
  );
}
