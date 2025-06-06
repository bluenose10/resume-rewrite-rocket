
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Loader2, Palette, AlertCircle } from 'lucide-react';
import CVRedesignModal from './CVRedesignModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface CVUploadModalProps {
  onUploadSuccess?: (uploadedCvId: string) => void;
  children: React.ReactNode;
}

const CVUploadModal: React.FC<CVUploadModalProps> = ({ onUploadSuccess, children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCvId, setUploadedCvId] = useState<string | null>(null);
  const [showRedesignStep, setShowRedesignStep] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.type === 'application/pdf' || 
          uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(uploadedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type === 'application/pdf' || 
          uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(uploadedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your CV",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CV file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingPhase('Uploading file');
    setErrorDetails(null);
    
    try {
      console.log('Starting CV upload for user:', user.id);
      
      // Upload file to Supabase storage with user ID in path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      console.log('Uploading file to path:', filePath);
      
      // Simulate upload progress
      const uploadProgressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploaded-cvs')
        .upload(filePath, file);

      clearInterval(uploadProgressInterval);
      setUploadProgress(100);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);
      setProcessingPhase('Generating file URL');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploaded-cvs')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);
      setProcessingPhase('Saving CV metadata');

      // Store CV metadata with user ID
      const { data: cvData, error: insertError } = await supabase
        .from('uploaded_cvs')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          file_type: file.type,
          file_url: publicUrl,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      console.log('CV metadata saved:', cvData);
      setProcessingPhase('Extracting CV content');

      // Call extraction function
      console.log('Calling extract-cv-content function...');
      const { data: extractionData, error: extractionError } = await supabase.functions.invoke('extract-cv-content', {
        body: { 
          cvId: cvData.id,
          fileUrl: publicUrl,
          fileName: file.name,
          fileType: file.type
        }
      });

      if (extractionError) {
        console.error('CV extraction failed:', extractionError);
        // Don't throw error here as CV was uploaded successfully
        toast({
          title: "CV uploaded with warning",
          description: "CV uploaded but content extraction had issues. You can still redesign it.",
          variant: "default"
        });
      } else {
        console.log('CV extraction result:', extractionData);
        toast({
          title: "CV uploaded successfully",
          description: "Your CV has been processed. Now you can redesign it with premium templates!"
        });
      }

      setProcessingPhase('Complete');
      
      // Show redesign step
      setUploadedCvId(cvData.id);
      setShowRedesignStep(true);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(cvData.id);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrorDetails(error.message);
      toast({
        title: "Upload failed",
        description: `Failed to upload CV: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRedesignComplete = (sessionId: string) => {
    // Reset form and close modal
    setFile(null);
    setUploadedCvId(null);
    setShowRedesignStep(false);
    setIsOpen(false);
    
    toast({
      title: "CV redesigned successfully!",
      description: "Your redesigned CV is ready. You can now use it in the resume builder."
    });
  };

  const resetModal = () => {
    setFile(null);
    setUploadedCvId(null);
    setShowRedesignStep(false);
    setUploadProgress(0);
    setProcessingPhase('');
    setErrorDetails(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!user && open) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your CV",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    setIsOpen(open);
    if (!open) resetModal();
  };

  const renderProcessingProgress = () => (
    <div className="space-y-4">
      <Progress value={uploadProgress} className="h-2" />
      <p className="text-sm text-center text-gray-600">
        {processingPhase}... {Math.round(uploadProgress)}%
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        <div>
          <h4 className="font-semibold text-red-700">Upload Failed</h4>
          <p className="text-sm text-red-600 mt-1">
            {errorDetails || "There was an error uploading your CV. Please try again."}
          </p>
        </div>
      </div>
      <Button 
        onClick={resetModal} 
        className="w-full mt-4"
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showRedesignStep ? 'Redesign Your CV' : 'Upload Your Existing CV'}
          </DialogTitle>
        </DialogHeader>
        
        {showRedesignStep && uploadedCvId ? (
          <div className="space-y-4 text-center">
            <div className="p-6 bg-green-50 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Upload Complete!</h3>
              <p className="text-green-700 text-sm">
                Your CV has been successfully uploaded and processed. 
                Now choose a premium template to redesign it with AI.
              </p>
            </div>
            
            <CVRedesignModal 
              cvId={uploadedCvId} 
              onRedesignComplete={handleRedesignComplete}
            >
              <Button className="w-full" size="lg">
                <Palette className="mr-2 h-4 w-4" />
                Choose Template & Redesign
              </Button>
            </CVRedesignModal>
            
            <Button 
              variant="outline" 
              onClick={resetModal}
              className="w-full"
            >
              Skip Redesign (Use Original)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {errorDetails && renderErrorState()}
            
            {!errorDetails && (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="mx-auto h-12 w-12 text-green-500" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="font-medium">Drop your CV here</p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400">Supports: PDF and DOCX files</p>
                  </div>
                )}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </div>
            )}

            {isUploading && renderProcessingProgress()}

            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !file || !!errorDetails}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Upload CV'
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center">
              By uploading, you agree that your CV will be processed using AI technology 
              to extract and optimize its content.
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
