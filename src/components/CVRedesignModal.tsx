
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Loader2, CheckCircle, FileText, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ResumeData } from '@/types/resume';

interface CVRedesignModalProps {
  cvId: string;
  onRedesignComplete?: (sessionId: string) => void;
  children: React.ReactNode;
}

interface RedesignState {
  sessionId: string | null;
  optimizedContent: ResumeData | null;
  isLoading: boolean;
  error: string | null;
  stage: 'selecting' | 'processing' | 'complete' | 'error';
}

const CVRedesignModal: React.FC<CVRedesignModalProps> = ({ cvId, onRedesignComplete, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [redesignState, setRedesignState] = useState<RedesignState>({
    sessionId: null,
    optimizedContent: null,
    isLoading: false,
    error: null,
    stage: 'selecting'
  });
  const { toast } = useToast();

  // Fetch CV data to display info about the CV being redesigned
  const { data: cvData } = useQuery({
    queryKey: ['cv-data', cvId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploaded_cvs')
        .select('*')
        .eq('id', cvId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!cvId && isOpen
  });

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
    },
    enabled: isOpen
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

    setRedesignState({
      ...redesignState,
      isLoading: true,
      error: null,
      stage: 'processing'
    });

    try {
      console.log('Starting redesign process with template:', selectedTemplate);
      const { data, error } = await supabase.functions.invoke('redesign-cv', {
        body: { 
          cvId: cvId,
          templateId: selectedTemplate
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.message || 'Redesign failed');

      console.log('Redesign successful:', data);
      
      setRedesignState({
        sessionId: data.sessionId,
        optimizedContent: data.optimizedContent,
        isLoading: false,
        error: null,
        stage: 'complete'
      });

      toast({
        title: "CV redesigned successfully!",
        description: "Your CV has been optimized with AI based on the selected template style."
      });
      
    } catch (error) {
      console.error('Redesign error:', error);
      
      setRedesignState({
        ...redesignState,
        isLoading: false,
        error: error.message || 'Failed to redesign CV',
        stage: 'error'
      });
      
      toast({
        title: "Redesign failed",
        description: error.message || "Failed to redesign your CV. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    if (redesignState.sessionId && onRedesignComplete) {
      onRedesignComplete(redesignState.sessionId);
    }
    setIsOpen(false);
    resetState();
  };

  const resetState = () => {
    setSelectedTemplate(null);
    setRedesignState({
      sessionId: null,
      optimizedContent: null,
      isLoading: false,
      error: null,
      stage: 'selecting'
    });
  };

  const handleRetry = () => {
    setRedesignState({
      ...redesignState,
      error: null,
      stage: 'selecting'
    });
  };

  const renderTemplateSelection = () => (
    <>
      <p className="text-gray-600 mb-4">
        Choose a premium template to redesign your CV using AI. Our system will analyze the template's 
        design patterns and optimize your content to match the professional style.
      </p>

      {cvData && (
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Using your uploaded CV</h3>
                <p className="text-sm text-gray-600">{cvData.original_filename}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      <div className="flex justify-end gap-4 mt-6">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleRedesign} 
          disabled={!selectedTemplate}
        >
          Redesign CV
        </Button>
      </div>
    </>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
      <h3 className="text-xl font-semibold mb-2">Redesigning Your CV</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Our AI is analyzing your CV content and optimizing it according to the selected 
        template style. This typically takes 15-30 seconds.
      </p>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center py-4">
      <div className="bg-green-50 rounded-full p-4 w-20 h-20 mx-auto mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">CV Redesigned Successfully!</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        Your CV has been professionally redesigned using AI. The content has been optimized 
        to match the selected template style while highlighting your skills and achievements.
      </p>
      <Button onClick={handleComplete} className="w-full sm:w-auto">
        Continue to Resume Builder
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-4">
      <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Redesign Failed</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-2">
        We encountered an error while redesigning your CV.
      </p>
      {redesignState.error && (
        <p className="text-red-500 text-sm mb-6">{redesignState.error}</p>
      )}
      <Button onClick={handleRetry} className="w-full sm:w-auto" variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (redesignState.stage) {
      case 'selecting':
        return renderTemplateSelection();
      case 'processing':
        return renderProcessing();
      case 'complete':
        return renderComplete();
      case 'error':
        return renderError();
      default:
        return renderTemplateSelection();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetState();
      }}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`${
        redesignState.stage === 'selecting' ? 'max-w-4xl' : 'max-w-md'
      } max-h-[80vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {redesignState.stage === 'complete' 
              ? 'CV Redesign Complete' 
              : 'Redesign Your CV with Premium Templates'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVRedesignModal;
