// src/app/(landing)/careers/[id]/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Upload,
  Loader2,
  XCircle
} from "lucide-react";
import { useSession } from "next-auth/react";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  createdAt: string;
  applicationCount: number;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    
    const [job, setJob] = useState<JobListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    
    const [formData, setFormData] = useState({
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      coverLetter: "",
      resumeUrl: "",
    });
  
    useEffect(() => {
      if (session) {
        setFormData(prev => ({
          ...prev,
          fullName: session.user.name || prev.fullName,
          email: session.user.email || prev.email,
          phone: session.user.phone || prev.phone,
        }));
      }
    }, [session]);
  
    useEffect(() => {
      fetchJobDetails();
    }, [params.id]);
  
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Job Not Found",
              description: "This job posting is no longer available.",
              variant: "destructive",
            });
            router.push("/careers");
            return;
          }
          throw new Error("Failed to fetch job details");
        }
        
        const data = await response.json();
        setJob(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleApply = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!job) return;
      
      // Basic form validation
      if (!formData.fullName || !formData.email) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and email to apply.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        setFormSubmitting(true);
        
        const response = await fetch(`/api/jobs/${job.id}/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to submit application");
        }
        
        setApplyDialogOpen(false);
        setSuccessDialogOpen(true);
        
        // Reset form data
        setFormData({
          fullName: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: session?.user?.phone || "",
          coverLetter: "",
          resumeUrl: "",
        });
      } catch (error: unknown) {
        toast({
          title: "Application Failed",
          description: error instanceof Error ? error.message : "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFormSubmitting(false);
      }
    };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

    function handleResumeUpload(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        // Validate file type and size
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a PDF, DOC, or DOCX file.",
                variant: "destructive",
            });
            return;
        }

        if (file.size > maxSize) {
            toast({
                title: "File Too Large",
                description: "The file size must not exceed 5MB.",
                variant: "destructive",
            });
            return;
        }

        // Simulate file upload and set the resume URL
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({
                ...prev,
                resumeUrl: reader.result as string,
            }));
            toast({
                title: "Resume Uploaded",
                description: "Your resume has been successfully uploaded.",
                variant: "default",
            });
        };
        reader.readAsDataURL(file);
    }

  return (
    <div className="min-h-screen pb-20">
      <GradientBackground />
      
      {/* Job Details Section */}
      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
        <Link 
          href="/careers" 
          className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Positions
        </Link>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading job details...</p>
          </div>
        ) : job ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Information */}
            <div className="lg:col-span-2">
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-gray-800 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <Badge variant="secondary" className="mt-2 md:mt-0 w-fit">
                    {job.applicationCount} {job.applicationCount === 1 ? 'Applicant' : 'Applicants'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start">
                    <Building className="w-5 h-5 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Department</p>
                      <p className="font-medium">{job.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Posted On</p>
                      <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                  <div className="text-gray-300 prose prose-invert max-w-none">
                    {job.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {job.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Application Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-black/20 backdrop-blur-md border border-gray-800">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Apply for this Position</h2>
                  <p className="text-gray-400 mb-6">
                    Submit your application to join our team in this role. We&apos;ll review your qualifications and get back to you.
                  </p>
                  
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={() => setApplyDialogOpen(true)}
                  >
                    Apply Now
                  </Button>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 text-green-500" />
                      <p className="text-sm text-gray-300">Quick application process</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 text-green-500" />
                      <p className="text-sm text-gray-300">Resume and cover letter optional</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 text-green-500" />
                      <p className="text-sm text-gray-300">Hear back within 1-2 weeks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/20 backdrop-blur-md rounded-xl border border-gray-800">
            <XCircle className="mx-auto h-12 w-12 mb-4 text-red-500" />
            <h3 className="text-xl font-semibold mb-2">Job Not Found</h3>
            <p className="text-gray-400 mb-4">
              This job posting may have been removed or is no longer active.
            </p>
            <Link href="/careers">
              <Button>View All Jobs</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {job?.title}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleApply} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                placeholder="Tell us why you're interested in this position and why you'd be a good fit."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">Resume</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("resume")?.click()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </Button>
                {formData.resumeUrl && (
                  <span className="text-sm text-green-500">Resume uploaded</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyDialogOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md">
          <div className="text-center py-4">
            <div className="bg-green-500/20 p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-400 mb-6">
              Thank you for applying to {job?.title}. We&apos;ve received your application and will review it shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSuccessDialogOpen(false);
                  router.push("/careers");
                }}
              >
                View More Jobs
              </Button>
              <Button
                onClick={() => {
                  setSuccessDialogOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
