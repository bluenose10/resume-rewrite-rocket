
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PremiumTemplate {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  industry: string;
  is_active: boolean;
  upload_date: string;
}

export const usePremiumTemplates = () => {
  const [templates, setTemplates] = useState<PremiumTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_templates')
        .select('*')
        .eq('is_active', true)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching premium templates:', error);
        return;
      }

      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching premium templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadTemplate = async (file: File, metadata: Omit<PremiumTemplate, 'id' | 'image_url' | 'upload_date'>) => {
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('premium-templates')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('premium-templates')
        .getPublicUrl(fileName);

      // Insert template record
      const { data, error } = await supabase
        .from('premium_templates')
        .insert({
          ...metadata,
          image_url: publicUrl
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Trigger AI analysis
      await supabase.functions.invoke('analyze-template-design', {
        body: {
          templateId: data.id,
          imageUrl: publicUrl
        }
      });

      await fetchTemplates();
      return data;
    } catch (error) {
      console.error('Error uploading template:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    uploadTemplate,
    refreshTemplates: fetchTemplates
  };
};
