// src/app/admin/applications/page.tsx
"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  X, 
  ArrowLeft, 
  Download,
  Mail, 
  Phone, 
  Calendar
} from "lucide-react";

// Define TypeScript interfaces
interface JobApplication {
  id: string;
  jobId: string;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
  userId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  coverLetter: string | null;
  resumeUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface JobListing {
  id: string;
  title: string;
  department: string;
}

export default function ApplicationsManagementPage() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | "all">(jobIdParam || "all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<JobApplication | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  const { toast } = useToast();

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobIdParam) {
      setSelectedJobId(jobIdParam);
    }
  }, [jobIdParam]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/applications");
      
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs");
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(true);
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
      
      fetchApplications();
      
      // If we're viewing an application, update its status in the modal
      if (currentApplication && currentApplication.id === applicationId) {
        setCurrentApplication({
          ...currentApplication,
          status: newStatus,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const viewApplication = (application: JobApplication) => {
    setCurrentApplication(application);
    setIsViewDialogOpen(true);
  };

  const downloadResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "reviewed":
        return "default";
      case "interviewed":
        return "default";
      case "rejected":
        return "destructive";
      case "accepted":
        return "outline";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter applications based on search term, job, and status
  const filteredApplications = applications.filter((app) => {
    // Filter by search term
    const searchMatch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.phone && app.phone.includes(searchTerm));
    
    // Filter by job
    const jobMatch = selectedJobId === "all" || app.jobId === selectedJobId;
    
    // Filter by status
    const statusMatch = selectedStatus === "all" || app.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return searchMatch && jobMatch && statusMatch;
  });

  // Get initial letters for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        {jobIdParam && (
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Applications
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="jobFilter" className="text-sm font-medium mb-1 block">
            Filter by Job
          </Label>
          <Select
            value={selectedJobId}
            onValueChange={(value) => setSelectedJobId(value)}
          >
            <SelectTrigger id="jobFilter">
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title} - {job.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="statusFilter" className="text-sm font-medium mb-1 block">
            Filter by Status
          </Label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="searchFilter" className="text-sm font-medium mb-1 block">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="searchFilter"
              className="pl-10 pr-10"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm || selectedJobId !== "all" || selectedStatus !== "all"
            ? "No applications match your filters"
            : "No applications found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant={getStatusBadgeVariant(app.status) || "default"}>
                    {app.status}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {formatDate(app.createdAt)}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(app.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{app.fullName}</CardTitle>
                    <CardDescription className="truncate">
                      {app.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-2">
                  <p className="text-sm font-medium">Applied for</p>
                  <p className="text-sm">{app.job.title}</p>
                  <p className="text-xs text-gray-500">{app.job.department} - {app.job.location}</p>
                </div>
                
                {app.coverLetter && (
                  <div>
                    <p className="text-sm font-medium">Cover Letter</p>
                    <p className="text-sm line-clamp-3">{app.coverLetter}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => viewApplication(app)}
                >
                  View Details
                </Button>
                {app.resumeUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadResume(app.resumeUrl!)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {currentApplication && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{getInitials(currentApplication.fullName)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold">{currentApplication.fullName}</h3>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${currentApplication.email}`} className="text-blue-500 hover:underline">
                      {currentApplication.email}
                    </a>
                  </div>
                  
                  {currentApplication.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${currentApplication.phone}`} className="text-blue-500 hover:underline">
                        {currentApplication.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Applied on {formatDate(currentApplication.createdAt)}</span>
                  </div>
                </div>
                
                <Badge variant={getStatusBadgeVariant(currentApplication.status)} className="ml-auto sm:ml-0">
                  {currentApplication.status}
                </Badge>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium">Applied Position</h4>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                  <p className="font-medium">{currentApplication.job.title}</p>
                  <p className="text-sm text-gray-500">
                    {currentApplication.job.department} - {currentApplication.job.location}
                  </p>
                </div>
              </div>
              
              {currentApplication.coverLetter && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium">Cover Letter</h4>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md whitespace-pre-wrap">
                    {currentApplication.coverLetter}
                  </div>
                </div>
              )}
              
              {currentApplication.resumeUrl && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium">Resume</h4>
                  <Button
                    variant="outline"
                    onClick={() => downloadResume(currentApplication.resumeUrl!)}
                    className="w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              )}
              
              <div className="space-y-2 border-t pt-4">
                <h4 className="font-medium">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {["pending", "reviewed", "interviewed", "rejected", "accepted"].map((status) => (
                    <Button
                      key={status}
                      variant={currentApplication.status.toLowerCase() === status ? "default" : "outline"}
                      size="sm"
                      disabled={statusUpdateLoading || currentApplication.status.toLowerCase() === status}
                      onClick={() => handleUpdateStatus(currentApplication.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}