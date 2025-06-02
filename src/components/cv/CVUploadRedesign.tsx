
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useCVUpload } from '@/hooks/useCVUpload';
import { ResumeData } from '@/types/resume';
import { toast } from 'sonner';

interface CVUploadRedesignProps {
  onResumeDataExtracted: (data: ResumeData) => void;
}

const CVUploadRedesign: React.FC<CVUploadRedesignProps> = ({ onResumeDataExtracted }) => {
  const { isUploading, isProcessing, uploadCV, processCV } = useCVUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
    } else {
      toast.error('Please upload a PDF file or image');
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) {
      toast.error('Please select a CV file');
      return;
    }

    try {
      toast.info('Uploading your CV...');
      
      // Upload the CV
      const uploadedCV = await uploadCV(selectedFile);
      
      toast.info('Processing your CV with AI...');
      
      // Process the CV with AI
      const extractedData = await processCV(uploadedCV.id);
      
      toast.success('CV processed successfully! Your data has been extracted.');
      
      // Pass the extracted data to parent component
      onResumeDataExtracted(extractedData);
      
      // Reset form
      setSelectedFile(null);
      const fileInput = document.getElementById('cv-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('CV processing error:', error);
      toast.error('Failed to process CV. Please try again.');
    }
  };

  const isLoading = isUploading || isProcessing;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Upload & Redesign Your CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600">
          Upload your existing CV and our AI will extract the content and redesign it using our premium templates.
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <FileText className="h-12 w-12 text-gray-400" />
            <div>
              <Label htmlFor="cv-file" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <span className="text-gray-600"> or drag and drop your CV</span>
              </Label>
              <Input
                id="cv-file"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
            </div>
            <div className="text-sm text-gray-500">
              Supports PDF, DOC, DOCX, and image files
            </div>
          </div>
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium">{selectedFile.name}</div>
              <div className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button 
          onClick={handleUploadAndProcess}
          disabled={!selectedFile || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Processing with AI...'}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Redesign CV
            </>
          )}
        </Button>

        {/* Process Description */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>• AI will extract your personal information, experience, and skills</div>
          <div>• Content will be automatically formatted to our resume structure</div>
          <div>• You can then customize and export your redesigned resume</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVUploadRedesign;
