
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Loader2, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CVRedesignModalProps {
  cvId: string;
  onRedesignComplete?: (sessionId: string) => void;
  children: React.ReactNode;
}

const CVRedesignModal: React.FC<CVRedesignModalProps> = ({ cvId, onRedesignComplete, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isRedesigning, setIsRedesigning] = useState(false);
  const { toast } = useToast();

  // Fetch available premium templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['premium-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premium_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleRedesign = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No template selected",
        description: "Please select a template to redesign your CV",
        variant: "destructive"
      });
      return;
    }

    setIsRedesigning(true);
    try {
      const { data, error } = await supabase.functions.invoke('redesign-cv', {
        body: { 
          cvId: cvId,
          templateId: selectedTemplate
        }
      });

      if (error) throw error;

      toast({
        title: "CV redesigned successfully!",
        description: "Your CV has been redesigned using AI and the selected template style."
      });

      setIsOpen(false);
      setSelectedTemplate(null);
      
      if (onRedesignComplete && data.sessionId) {
        onRedesignComplete(data.sessionId);
      }
      
    } catch (error) {
      console.error('Redesign error:', error);
      toast({
        title: "Redesign failed",
        description: "Failed to redesign your CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRedesigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Redesign Your CV with Premium Templates
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-gray-600">
            Choose a premium template to redesign your CV using AI. Our system will analyze the template's 
            design patterns and optimize your content to match the professional style.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates?.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="relative">
                    <img 
                      src={template.image_url} 
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.category && (
                        <Badge variant="secondary">{template.category}</Badge>
                      )}
                      {template.industry && (
                        <Badge variant="outline">{template.industry}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isRedesigning}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRedesign} 
              disabled={!selectedTemplate || isRedesigning}
            >
              {isRedesigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redesigning with AI...
                </>
              ) : (
                'Redesign CV'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVRedesignModal;
