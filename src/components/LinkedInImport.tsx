
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Linkedin, Loader2, FileText, Copy } from 'lucide-react';
import { parseLinkedInText, validateLinkedInText, LinkedInImportData } from '@/services/linkedinService';
import { ResumeData } from '@/types/resume';

interface LinkedInImportProps {
  onImportData: (data: Partial<ResumeData>) => void;
}

const LinkedInImport: React.FC<LinkedInImportProps> = ({ onImportData }) => {
  const [profileText, setProfileText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<LinkedInImportData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleExtractData = async () => {
    if (!profileText.trim()) {
      toast({
        title: "Text Required",
        description: "Please paste your LinkedIn profile content in the text area",
        variant: "destructive"
      });
      return;
    }

    if (!validateLinkedInText(profileText)) {
      toast({
        title: "Invalid Content",
        description: "The text doesn't appear to contain LinkedIn profile information. Please include your About section, experience, education, and skills.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const extractedData = await parseLinkedInText(profileText);
      setPreviewData(extractedData);
      setShowPreview(true);
      
      toast({
        title: "Profile Parsed Successfully!",
        description: "Review the extracted data and click Import to apply it to your resume."
      });
    } catch (error) {
      console.error('LinkedIn text parsing error:', error);
      toast({
        title: "Parsing Failed",
        description: error instanceof Error ? error.message : "Failed to parse LinkedIn profile text. Please try again.",
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
    setProfileText('');
    setPreviewData(null);

    toast({
      title: "LinkedIn Data Imported!",
      description: "Your resume has been updated with LinkedIn profile data. You can now review and edit as needed."
    });
  };

  const copyInstructions = () => {
    const instructions = `How to copy your LinkedIn profile:

1. Go to your LinkedIn profile page
2. Copy the following sections and paste them below:
   
   • About/Summary section
   • Experience section (all positions)
   • Education section
   • Skills section
   
3. You can copy everything at once or section by section
4. Include company names, job titles, dates, and descriptions`;

    navigator.clipboard.writeText(instructions);
    toast({
      title: "Instructions Copied!",
      description: "The copying instructions have been copied to your clipboard."
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
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="linkedin-text">LinkedIn Profile Content</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={copyInstructions}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Instructions
            </Button>
          </div>
          <Textarea
            id="linkedin-text"
            placeholder="Paste your LinkedIn profile content here...

Include your:
• About/Summary section
• Work Experience (with descriptions)
• Education
• Skills
• Any other relevant profile information

You can copy everything from your LinkedIn profile or paste it section by section."
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <Button 
          onClick={handleExtractData}
          disabled={isImporting || !profileText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Parsing Profile...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Parse LinkedIn Profile
            </>
          )}
        </Button>

        <div className="text-xs text-blue-600 space-y-2">
          <p className="font-medium">Quick Copy Guide:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Open your LinkedIn profile in another tab</li>
            <li>Copy your "About" section and paste it above</li>
            <li>Copy each work experience (company, role, dates, description)</li>
            <li>Copy your education and skills</li>
            <li>Click "Parse LinkedIn Profile" when done</li>
          </ol>
          <p className="text-blue-500 italic">💡 Tip: Include job descriptions for better results!</p>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Parsed LinkedIn Data</DialogTitle>
            </DialogHeader>
            
            {previewData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Personal Information</h3>
                  <p>{previewData.personalInfo.firstName} {previewData.personalInfo.lastName}</p>
                  <p className="text-sm text-gray-600">{previewData.personalInfo.location}</p>
                  {previewData.personalInfo.linkedin && (
                    <p className="text-sm text-blue-600">{previewData.personalInfo.linkedin}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Professional Summary</h3>
                  <p className="text-sm">{previewData.summary || 'No summary found'}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Experience ({previewData.experience.length} positions)</h3>
                  {previewData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-200 pl-3 mb-2">
                      <p className="font-medium">{exp.position} at {exp.company}</p>
                      <p className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      {exp.description && (
                        <p className="text-gray-700 text-xs mt-1">{exp.description.slice(0, 100)}...</p>
                      )}
                    </div>
                  ))}
                  {previewData.experience.length > 2 && (
                    <p className="text-sm text-gray-600">...and {previewData.experience.length - 2} more</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-700">Education ({previewData.education.length} entries)</h3>
                  {previewData.education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-200 pl-3 mb-2">
                      <p className="font-medium">{edu.degree} in {edu.field}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                  ))}
                  {previewData.education.length > 2 && (
                    <p className="text-sm text-gray-600">...and {previewData.education.length - 2} more</p>
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
