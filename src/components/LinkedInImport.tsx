
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Linkedin, Download, Loader2 } from 'lucide-react';
import { extractLinkedInData, validateLinkedInUrl, LinkedInImportData } from '@/services/linkedinService';
import { ResumeData } from '@/types/resume';

interface LinkedInImportProps {
  onImportData: (data: Partial<ResumeData>) => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ onImportData }) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<LinkedInImportData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleExtractData = async () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "LinkedIn URL Required",
        description: "Please enter a LinkedIn profile URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const extractedData = await extractLinkedInData(linkedinUrl);
      setPreviewData(extractedData);
      setShowPreview(true);
      
      toast({
        title: "Data Extracted Successfully!",
        description: "Review the extracted data and click Import to apply it to your resume."
      });
    } catch (error) {
      console.error('LinkedIn import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to extract LinkedIn data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportConfirm = () => {
    if (!previewData) return;

    // Convert LinkedInImportData to ResumeData format
    const resumeUpdate: Partial<ResumeData> = {
      personalInfo: {
        firstName: previewData.personalInfo.firstName,
        lastName: previewData.personalInfo.lastName,
        email: '', // Keep existing email
        phone: '', // Keep existing phone
        location: previewData.personalInfo.location,
        linkedin: previewData.personalInfo.linkedin,
        github: '', // Keep existing github
        website: '' // Keep existing website
      },
      summary: previewData.summary,
      experience: previewData.experience.map(exp => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...exp
      })),
      education: previewData.education.map(edu => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...edu,
        gpa: ''
      })),
      skills: previewData.skills
    };

    onImportData(resumeUpdate);
    setShowPreview(false);
    setLinkedinUrl('');
    setPreviewData(null);

    toast({
      title: "LinkedIn Data Imported!",
      description: "Your resume has been updated with LinkedIn profile data. You can now review and edit as needed."
    });
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Linkedin className="h-5 w-5" />
          Import from LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
          <Input
            id="linkedin-url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
            className="mt-1"
          />
        </div>
        
        <Button 
          onClick={handleExtractData}
          disabled={isImporting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting Data...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Extract LinkedIn Data
            </>
          )}
        </Button>

        <p className="text-xs text-blue-600">
          Our AI will extract your professional information from your LinkedIn profile and optimize it for your resume.
        </p>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review LinkedIn Data</DialogTitle>
            </DialogHeader>
            
            {previewData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Personal Information</h3>
                  <p>{previewData.personalInfo.firstName} {previewData.personalInfo.lastName}</p>
                  <p className="text-sm text-gray-600">{previewData.personalInfo.location}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Professional Summary</h3>
                  <p className="text-sm">{previewData.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Experience ({previewData.experience.length} positions)</h3>
                  {previewData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-200 pl-3 mb-2">
                      <p className="font-medium">{exp.position} at {exp.company}</p>
                      <p className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                  ))}
                  {previewData.experience.length > 2 && (
                    <p className="text-sm text-gray-600">...and {previewData.experience.length - 2} more</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Skills ({previewData.skills.length} skills)</h3>
                  <div className="flex flex-wrap gap-1">
                    {previewData.skills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {previewData.skills.length > 8 && (
                      <span className="text-xs text-gray-600">+{previewData.skills.length - 8} more</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleImportConfirm} className="flex-1">
                    Import This Data
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LinkedInImport;
