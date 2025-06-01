
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft, Clock } from 'lucide-react';
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
      // Create a temporary link to download the file
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

      // Update remaining downloads count
      setRemainingDownloads(prev => Math.max(0, prev - 1));
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold">Verifying Your Purchase</h2>
            <p className="text-gray-600 text-center">
              Please wait while we confirm your payment and prepare your download...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Purchase Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for purchasing the {templateName?.replace('-', ' ')} template
          </p>
        </div>

        {/* Download Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Your Template Download
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                {templateName?.replace('-', ' ')} Resume Template
              </h3>
              <p className="text-blue-800 text-sm">
                Professional Microsoft Word document ready for customization
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Downloads remaining: <span className="font-semibold">{remainingDownloads}</span>
              </div>
              <Button 
                onClick={handleDownload}
                disabled={!downloadUrl || remainingDownloads <= 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Now
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>• Template will download as a .docx file</p>
              <p>• Compatible with Microsoft Word 2016 or newer</p>
              <p>• You have 3 total downloads for this purchase</p>
              <p>• Need help? Contact our support team</p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How to Use Your Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <p>Download and open the template in Microsoft Word</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <p>Replace the placeholder text with your information</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <p>Customize colors, fonts, and layout to match your style</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <p>Save as PDF for job applications</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Browse More Templates
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSuccessPage;
