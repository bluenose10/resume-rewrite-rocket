import React, { useState } from 'react';
import ResumeForm from '@/components/ResumeForm';
import ResumePreview from '@/components/ResumePreview';
import { useToast } from '@/hooks/use-toast';
import { optimizeResumeContent } from '@/services/openaiService';
import { generatePDF } from '@/utils/pdfGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Wand2, Download, FileText, Zap, Shield, Clock } from 'lucide-react';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [showBuilder, setShowBuilder] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleOptimize = async () => {
    if (!resumeData.summary && resumeData.experience.length === 0 && resumeData.projects.length === 0) {
      toast({
        title: "No Content to Optimize",
        description: "Please add some content to your resume before optimizing.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      console.log('Starting resume optimization...');
      const optimizedContent = await optimizeResumeContent(resumeData);
      console.log('Optimization completed:', optimizedContent);

      // Update resume data with optimized content
      const updatedData = { ...resumeData };
      
      if (optimizedContent.summary) {
        updatedData.summary = optimizedContent.summary;
      }

      if (optimizedContent.experience && optimizedContent.experience.length > 0) {
        updatedData.experience = updatedData.experience.map((exp, index) => ({
          ...exp,
          description: optimizedContent.experience[index]?.description || exp.description
        }));
      }

      if (optimizedContent.projects && optimizedContent.projects.length > 0) {
        updatedData.projects = updatedData.projects.map((proj, index) => ({
          ...proj,
          description: optimizedContent.projects[index]?.description || proj.description
        }));
      }

      setResumeData(updatedData);
      
      toast({
        title: "Resume Optimized!",
        description: "Your resume content has been enhanced for better ATS compatibility and impact."
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `${resumeData.personalInfo.firstName || 'Resume'}_${resumeData.personalInfo.lastName || 'Document'}.pdf`;
      await generatePDF('resume-content', fileName);
      
      toast({
        title: "PDF Downloaded!",
        description: "Your resume has been saved as a PDF file."
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowBuilder(false)}
              className="flex items-center gap-2"
            >
              ← Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              AI-Powered Resume Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a professional, ATS-friendly resume with AI optimization. 
              Fill in your information and let our AI enhance your content for maximum impact.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <div className="lg:max-h-screen lg:overflow-y-auto lg:pr-4">
              <ResumeForm
                onDataChange={handleDataChange}
                onOptimize={handleOptimize}
                isOptimizing={isOptimizing}
              />
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-8">
              <ResumePreview
                data={resumeData}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-6 leading-tight">
            Create your perfect resume<br />
            <span className="text-gray-900">in minutes - now with AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands who landed their dream jobs with our ATS-optimized, AI-powered resume builder. 
            Professional results in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => setShowBuilder(true)}
              className="text-lg px-8 py-4 h-auto"
            >
              Start Building Now - It's Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto"
            >
              View Sample Resumes
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">ATS Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
              <div className="text-gray-600">Average Build Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Resume Builder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by career experts and powered by AI to give you the best chance of landing interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">ATS-Friendly</h3>
                <p className="text-gray-600">
                  Optimized to pass applicant tracking systems used by 98% of Fortune 500 companies
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wand2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered</h3>
                <p className="text-gray-600">
                  Smart content optimization that enhances your experience descriptions for maximum impact
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Templates</h3>
                <p className="text-gray-600">
                  Industry-standard layouts designed by hiring managers and career coaches
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick & Easy</h3>
                <p className="text-gray-600">
                  Create a professional resume in minutes, not hours. No design skills required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Your Perfect Resume in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes it easy to create a professional resume that gets results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                STEP 1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Add Your Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Fill in your personal details, work experience, education, and skills using our intuitive form
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wand2 className="h-10 w-10 text-white" />
              </div>
              <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                STEP 2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI Optimizes Your Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes and enhances your content for ATS compatibility and maximum impact with recruiters
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-10 w-10 text-white" />
              </div>
              <div className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                STEP 3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Download Your Resume</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your professional, ATS-optimized resume as a PDF ready to send to employers
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setShowBuilder(true)}
              className="text-lg px-8 py-4 h-auto"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Building Your Resume Now
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our AI-powered resume builder helped professionals land their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">Landed at Google</span>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The AI optimization feature transformed my generic job descriptions into compelling achievements. Got 3 interviews in the first week!"
                </p>
                <div className="text-sm text-gray-500">- Sarah K., Software Engineer</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">50% More Interviews</span>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "After using this resume builder, my interview rate increased dramatically. The ATS optimization really works!"
                </p>
                <div className="text-sm text-gray-500">- Michael R., Marketing Manager</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <span className="font-semibold text-gray-900">Career Change Success</span>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Switching careers seemed impossible until I used this tool. The AI helped highlight my transferable skills perfectly."
                </p>
                <div className="text-sm text-gray-500">- Jennifer L., Data Analyst</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who used our AI-powered resume builder to get hired faster
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowBuilder(true)}
            className="text-lg px-8 py-4 h-auto bg-white text-blue-600 hover:bg-gray-50"
          >
            Create Your Resume Now - Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
