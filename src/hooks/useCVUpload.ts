
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ResumeData } from '@/types/resume';

interface UploadedCV {
  id: string;
  original_filename: string;
  file_url: string;
  file_type: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_content: ResumeData | null;
  processing_error: string | null;
}

export const useCVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadCV = async (file: File, userId?: string): Promise<UploadedCV> => {
    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId || 'anonymous'}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploaded-cvs')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for processing
      const { data: { publicUrl } } = supabase.storage
        .from('uploaded-cvs')
        .getPublicUrl(fileName);

      // Insert CV record
      const { data, error } = await supabase
        .from('uploaded_cvs')
        .insert({
          user_id: userId || null,
          original_filename: file.name,
          file_url: publicUrl,
          file_type: fileExt || 'unknown',
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as UploadedCV;
    } catch (error) {
      console.error('Error uploading CV:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const processCV = async (cvId: string): Promise<ResumeData> => {
    setIsProcessing(true);
    try {
      // Get CV details
      const { data: cvData, error: cvError } = await supabase
        .from('uploaded_cvs')
        .select('*')
        .eq('id', cvId)
        .single();

      if (cvError) {
        throw cvError;
      }

      // Trigger processing
      const { data, error } = await supabase.functions.invoke('process-cv-upload', {
        body: {
          cvId: cvId,
          fileUrl: cvData.file_url
        }
      });

      if (error) {
        throw error;
      }

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        const { data: updatedCV, error: checkError } = await supabase
          .from('uploaded_cvs')
          .select('*')
          .eq('id', cvId)
          .single();

        if (checkError) {
          throw checkError;
        }

        if (updatedCV.processing_status === 'completed') {
          return updatedCV.extracted_content as ResumeData;
        }

        if (updatedCV.processing_status === 'failed') {
          throw new Error(updatedCV.processing_error || 'CV processing failed');
        }

        // Wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      throw new Error('CV processing timeout');
    } catch (error) {
      console.error('Error processing CV:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isUploading,
    isProcessing,
    uploadCV,
    processCV
  };
};
