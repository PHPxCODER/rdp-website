// src/app/(landing)/careers/page.tsx
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Search, Building, MapPin, Calendar, Briefcase, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Join Our Team | ${siteConfig.name}`,
};
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

export default function CareersPage() {
  const searchParams = useSearchParams();
  const departmentParam = searchParams.get('department');
  const searchParam = searchParams.get('search');

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentParam || "all");
  const [departments, setDepartments] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedDepartment]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Build the URL with query parameters
      let url = "/api/jobs";
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      
      if (selectedDepartment && selectedDepartment !== "all") {
        params.append("department", selectedDepartment);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      const data = await response.json();
      setJobs(data);
      
      // Extract unique departments for the filter
      const uniqueDepartments = Array.from(
        new Set(data.map((job: JobListing) => job.department))
      );
      setDepartments(uniqueDepartments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job listings",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
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

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen">
      <GradientBackground />
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold mb-4 z-10 relative">Join Our Team</h1>
        <p className="text-xl max-w-3xl mx-auto mb-8 z-10 relative">
          Discover opportunities to grow, innovate, and make an impact with us at {siteConfig.name}.
        </p>
        
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-md p-6 rounded-xl border border-gray-800 z-10 relative">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search job title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:w-64">
              <Select
                value={selectedDepartment}
                onValueChange={(value) => setSelectedDepartment(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="container mx-auto px-4 pb-20 relative z-10">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4">Loading job listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-black/20 backdrop-blur-md rounded-xl border border-gray-800">
            <Briefcase className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No positions currently available</h3>
            <p className="text-gray-400 mb-4">
              There are no open positions matching your criteria at this time.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-black/20 backdrop-blur-md border border-gray-800 hover:border-gray-700 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.applicationCount} {job.applicationCount === 1 ? 'Applicant' : 'Applicants'}
                    </Badge>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(job.createdAt)}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-sm text-gray-400">
                      <Building className="w-4 h-4 mr-2" />
                      {job.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {truncateDescription(job.description)}
                  </p>
                  
                  {job.requirements.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Key Requirements:</p>
                      <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="line-clamp-1">{req}</li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-gray-500">+ {job.requirements.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Link href={`/careers/${job.id}`} className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2">
                      View Position <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}