// File: app/careers/apply/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"
import { useParams } from 'next/navigation';

export default function JobApplicationPage() {
  const params = useParams();
  const { data: session, status } = useSession()
  console.log(session, status)
  const jobId = params.id as string;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null as File | null,
    coverLetter: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [jobDetails, setJobDetails] = useState<{ title?: string, department?: string } | null>(null);

  useEffect(() => {
    // Fetch job details based on the job ID
    const fetchJobDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobDetails(data);
        } else {
          console.error('Failed to fetch job details');
          setJobDetails({ title: 'Unknown Position' });
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setJobDetails({ title: 'Unknown Position' });
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.files?.[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Create a FormData object to handle file uploads
      const submitData = new FormData();
      submitData.append('jobId', jobId);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('coverLetter', formData.coverLetter);
      
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      // Replace with your actual API endpoint for submitting applications
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        setSubmitMessage('Application submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          resume: null,
          coverLetter: ''
        });
      } else {
        const error = await response.json();
        setSubmitMessage(`Failed to submit application: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Apply for: {jobDetails?.title || 'Loading...'}
        </h1>
        {jobDetails?.department && (
          <p className="text-lg text-gray-600">{jobDetails.department}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">Job ID: {jobId}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium  mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={session?.user.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium mb-1">
            Resume (PDF or DOCX) *
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf,.docx"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum file size: 5MB
          </p>
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          />
        </div>

        {submitMessage && (
          <div className={`p-4 rounded-md ${submitMessage.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {submitMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}