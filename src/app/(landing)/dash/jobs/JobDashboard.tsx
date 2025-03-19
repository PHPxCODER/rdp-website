"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, TableColumn } from "@heroui/react";
import {
  Card,
  CardBody,
  CardHeader
} from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";
import { Badge } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Eye,
  User,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
} from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useToast } from "@/hooks/use-toast";

export default function JobDashboardPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      type: "Full-time",
      status: "active",
      applications: 12,
      postedDate: "March 1, 2024",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      status: "active",
      applications: 8,
      postedDate: "March 5, 2024",
    },
    {
      id: "3",
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      status: "active",
      applications: 15,
      postedDate: "March 3, 2024",
    },
    {
      id: "4",
      title: "Backend Engineer",
      department: "Engineering",
      location: "Austin, TX",
      type: "Full-time",
      status: "active",
      applications: 6,
      postedDate: "March 7, 2024",
    },
    {
      id: "5",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Chicago, IL (Hybrid)",
      type: "Full-time",
      status: "active",
      applications: 9,
      postedDate: "March 10, 2024",
    },
    {
      id: "6",
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      status: "active",
      applications: 7,
      postedDate: "March 12, 2024",
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: "app1",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      candidateName: "John Smith",
      candidateEmail: "john.smith@example.com",
      appliedDate: "March 15, 2024",
      status: "in-review",
    },
    {
      id: "app2",
      jobId: "1",
      jobTitle: "Senior Frontend Developer",
      candidateName: "Emily Johnson",
      candidateEmail: "emily.johnson@example.com",
      appliedDate: "March 14, 2024",
      status: "pending",
    },
    {
      id: "app3",
      jobId: "2",
      jobTitle: "Product Manager",
      candidateName: "Michael Brown",
      candidateEmail: "michael.brown@example.com",
      appliedDate: "March 12, 2024",
      status: "interview",
    },
    {
      id: "app4",
      jobId: "3",
      jobTitle: "UX/UI Designer",
      candidateName: "Sarah Davis",
      candidateEmail: "sarah.davis@example.com",
      appliedDate: "March 10, 2024",
      status: "rejected",
    },
    {
      id: "app5",
      jobId: "3",
      jobTitle: "UX/UI Designer",
      candidateName: "David Wilson",
      candidateEmail: "david.wilson@example.com",
      appliedDate: "March 11, 2024",
      status: "offer",
    },
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  });

  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);

interface JobFormInput {
    name: string;
    value: string;
}

const handleInputChange = (e: { target: JobFormInput }): void => {
    const { name, value } = e.target;
    setNewJob({
        ...newJob,
        [name]: value,
    });
};

  const handleSelectChange = (name: string, value: string) => {
    setNewJob({
      ...newJob,
      [name]: value,
    });
  };

  const handleAddJob = () => {
    const jobId = (jobs.length + 1).toString();
    const newJobEntry = {
      id: jobId,
      ...newJob,
      status: "active",
      applications: 0,
      postedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setJobs([...jobs, newJobEntry]);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
    });
    setIsAddingJob(false);

    toast({
      title: "Job Added",
      description: "The job posting has been successfully added.",
    });
  };

  const handleEditJob = (jobId: string) => {
    const job = jobs.find((job) => job.id === jobId);
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: "",
      requirements: "",
    });
    setCurrentJobId(jobId);
    setIsEditingJob(true);
  };

  const handleUpdateJob = () => {
    const updatedJobs = jobs.map((job) => {
      if (job.id === currentJobId) {
        return {
          ...job,
          title: newJob.title,
          department: newJob.department,
          location: newJob.location,
          type: newJob.type,
        };
      }
      return job;
    });

    setJobs(updatedJobs);
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
    });
    setCurrentJobId(null);
    setIsEditingJob(false);

    toast({
      title: "Job Updated",
      description: "The job posting has been successfully updated.",
    });
  };

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);

    toast({
      title: "Job Deleted",
      description: "The job posting has been successfully deleted.",
    });
  };

  const handleUpdateApplicationStatus = (applicationId: string, newStatus: string) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
        };
      }
      return app;
    });

    setApplications(updatedApplications);

    toast({
      title: "Status Updated",
      description: "The application status has been updated.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="flat"
            className="text-yellow-500 border-yellow-500"
          >
            Pending
          </Badge>
        );
      case "in-review":
        return (
          <Badge variant="flat" className="text-blue-500 border-blue-500">
            In Review
          </Badge>
        );
      case "interview":
        return (
          <Badge
            variant="flat"
            className="text-purple-500 border-purple-500"
          >
            Interview
          </Badge>
        );
      case "offer":
        return (
          <Badge variant="flat" className="text-green-500 border-green-500">
            Offer
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="flat" className="text-red-500 border-red-500">
            Rejected
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="flat"
            className="text-emerald-500 border-emerald-500"
          >
            Accepted
          </Badge>
        );
      default:
        return <Badge variant="flat">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl">CareerPortal</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Browse Jobs
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              My Applications
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="bordered">Dashboard</Button>
            </Link>
            <Link href="/admin">
              <Button>Admin Portal</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage job postings and applications
                </p>
              </div>
              <Dialog open={isAddingJob} onOpenChange={setIsAddingJob}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add New Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Job</DialogTitle>
                    <DialogDescription>
                      Create a new job posting. Fill out the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={newJob.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          name="department"
                          value={newJob.department}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Job Type</Label>
                        <Select
                          value={newJob.type}
                          onChange={(value) =>
                            handleSelectChange("type", value)
                          }
                        >
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">
                              Internship
                            </SelectItem>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={newJob.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newJob.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea
                        id="requirements"
                        name="requirements"
                        value={newJob.requirements}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="bordered"
                      onPress={() => setIsAddingJob(false)}
                    >
                      Cancel
                    </Button>
                    <Button onPress={handleAddJob}>Add Job</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditingJob} onOpenChange={setIsEditingJob}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Job</DialogTitle>
                    <DialogDescription>
                      Update the job posting details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Job Title</Label>
                      <Input
                        id="edit-title"
                        name="title"
                        value={newJob.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-department">Department</Label>
                        <Input
                          id="edit-department"
                          name="department"
                          value={newJob.department}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-type">Job Type</Label>
                        <Select
                          value={newJob.type}
                          onChange={(value) =>
                            handleSelectChange("type", value)
                          }
                        >
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">
                              Internship
                            </SelectItem>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-location">Location</Label>
                      <Input
                        id="edit-location"
                        name="location"
                        value={newJob.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="bordered"
                      onPress={() => setIsEditingJob(false)}
                    >
                      Cancel
                    </Button>
                    <Button onPress={handleUpdateJob}>Update Job</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs className="w-full">
              <Tab key="jobs" title="Job Postings" className="mt-6">
                <Card>
                  <CardHeader>
                    Manage Job Postings
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <TableHeader>
                          <TableColumn>Job Title</TableColumn>
                          <TableColumn>Department</TableColumn>
                          <TableColumn>Location</TableColumn>
                          <TableColumn>Type</TableColumn>
                          <TableColumn>Posted Date</TableColumn>
                          <TableColumn>Applications</TableColumn>
                          <TableColumn>Actions</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">
                              {job.title}
                            </TableCell>
                            <TableCell>{job.department}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.type}</TableCell>
                            <TableCell>{job.postedDate}</TableCell>
                            <TableCell>{job.applications}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onPress={() => handleEditJob(job.id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onPress={() => handleDeleteJob(job.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                                <Link href={`/jobs/${job.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="applications" title="Applications" className="mt-6">
                <Card>
                  <CardHeader>
                    Manage Applications
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableColumn>Candidate</TableColumn>
                          <TableColumn>Job Title</TableColumn>
                          <TableColumn>Applied Date</TableColumn>
                          <TableColumn>Status</TableColumn>
                          <TableColumn>Actions</TableColumn>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">
                                {application.candidateName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {application.candidateEmail}
                              </div>
                            </TableCell>
                            <TableCell>{application.jobTitle}</TableCell>
                            <TableCell>{application.appliedDate}</TableCell>
                            <TableCell>
                              {getStatusBadge(application.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Update Status
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Update Application Status
                                      </DialogTitle>
                                      <DialogDescription>
                                        Change the status of{" "}
                                        {application.candidateName}&apos;s
                                        application
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label>Current Status</Label>
                                        <div>
                                          {getStatusBadge(application.status)}
                                        </div>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="new-status">
                                          New Status
                                        </Label>
                                        <Select
                                          defaultSelectedKeys={[application.status]}
                                          onChange={(value) =>
                                            handleUpdateApplicationStatus(
                                              application.id,
                                              value
                                            )
                                          }
                                          label="Select status"
                                        >
                                         
                                            <SelectItem value="pending">
                                              Pending
                                            </SelectItem>
                                            <SelectItem value="in-review">
                                              In Review
                                            </SelectItem>
                                            <SelectItem value="interview">
                                              Interview
                                            </SelectItem>
                                            <SelectItem value="offer">
                                              Offer
                                            </SelectItem>
                                            <SelectItem value="rejected">
                                              Rejected
                                            </SelectItem>
                                            <SelectItem value="accepted">
                                              Accepted
                                            </SelectItem>
                                          
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button>Save Changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="sm">
                                  <User className="h-4 w-4" />
                                  <span className="sr-only">
                                    View Candidate
                                  </span>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">
                                    View Application
                                  </span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerPortal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
