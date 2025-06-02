import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Loader2, Palette } from 'lucide-react';
import CVRedesignModal from './CVRedesignModal';

interface CVUploadModalProps {
  onUploadSuccess?: (uploadedCvId: string) => void;
  children: React.ReactNode;
}

const CVUploadModal: React.FC<CVUploadModalProps> = ({ onUploadSuccess, children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCvId, setUploadedCvId] = useState<string | null>(null);
  const [showRedesignStep, setShowRedesignStep] = useState(false);
  const { toast } = useToast();

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
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CV file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploaded-cvs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploaded-cvs')
        .getPublicUrl(fileName);

      // Store CV metadata
      const { data: cvData, error: insertError } = await supabase
        .from('uploaded_cvs')
        .insert({
          original_filename: file.name,
          file_type: file.type,
          file_url: publicUrl,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Call extraction function
      const { error: extractionError } = await supabase.functions.invoke('extract-cv-content', {
        body: { 
          cvId: cvData.id,
          fileUrl: publicUrl,
          fileName: file.name,
          fileType: file.type
        }
      });

      if (extractionError) {
        console.warn('CV extraction failed:', extractionError);
        // Don't throw error here as CV was uploaded successfully
      }

      toast({
        title: "CV uploaded successfully",
        description: "Your CV has been processed. Now you can redesign it with premium templates!"
      });

      // Show redesign step
      setUploadedCvId(cvData.id);
      setShowRedesignStep(true);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(cvData.id);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload CV. Please try again.",
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
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
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
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
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !file}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Processing...
                </>
              ) : (
                'Upload CV'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVUploadModal;
