
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Clock, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TemplateSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [remainingDownloads, setRemainingDownloads] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(true);
  const [templateName, setTemplateName] = useState<string>('');

  const sessionId = searchParams.get('session_id');
  const template = searchParams.get('template');

  useEffect(() => {
    if (sessionId && template) {
      verifyPurchaseAndGetDownload();
    }
  }, [sessionId, template]);

  const verifyPurchaseAndGetDownload = async () => {
    try {
      setIsVerifying(true);
      
      const { data, error } = await supabase.functions.invoke('verify-template-purchase', {
        body: {
          sessionId: sessionId,
          templateName: template
        }
      });

      if (error) {
        throw error;
      }

      setDownloadUrl(data.downloadUrl);
      setRemainingDownloads(data.remainingDownloads);
      setTemplateName(data.templateName);

    } catch (error) {
      console.error('Error verifying purchase:', error);
      toast({
        title: "Verification Failed",
        description: "Unable to verify your purchase. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${templateName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your template download has begun!",
      });

      setRemainingDownloads(prev => Math.max(0, prev - 1));
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
          <div className="absolute top-20 -left-20 w-32 h-32 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        </div>
        
        <Card className="w-full max-w-md bg-white/15 backdrop-blur-sm border-white/20 relative z-10">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-white">Verifying Your Purchase</h2>
            <p className="text-gray-300 text-center">
              Please wait while we confirm your payment and prepare your download...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-32 h-32 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-brand-cyan mx-auto mb-4 glow-cyan" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Purchase Successful!
          </h1>
          <p className="text-lg text-gray-300">
            Thank you for purchasing the {templateName?.replace('-', ' ')} template
          </p>
        </div>

        {/* Download Card */}
        <Card className="mb-6 bg-white/15 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Download className="h-5 w-5 text-brand-cyan" />
              Your Template Download
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-brand-cyan/20 border border-brand-cyan/30 rounded-lg p-4">
              <h3 className="font-semibold text-brand-cyan mb-2">
                {templateName?.replace('-', ' ')} Resume Template
              </h3>
              <p className="text-gray-300 text-sm">
                Professional Microsoft Word document ready for customization
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4" />
                Downloads remaining: <span className="font-semibold text-brand-cyan">{remainingDownloads}</span>
              </div>
              <Button 
                onClick={handleDownload}
                disabled={!downloadUrl || remainingDownloads <= 0}
                className="bg-brand-cyan hover:bg-brand-cyan/90 text-black glow-cyan"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Now
              </Button>
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Template downloads as a .docx file
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Compatible with Microsoft Word 2016+
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                3 total downloads for this purchase
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="mb-6 bg-white/15 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How to Use Your Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-300">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan text-black rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <p>Download and open the template in Microsoft Word</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan text-black rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <p>Replace the placeholder text with your information</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan text-black rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <p>Customize colors, fonts, and layout to match your style</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan text-black rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <p>Save as PDF for job applications</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4 border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="bg-brand-cyan hover:bg-brand-cyan/90 text-black glow-cyan"
          >
            Browse More Templates
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSuccessPage;
