
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailVerificationStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const redirect_to = searchParams.get('redirect_to');

      if (!token_hash || !type) {
        setStatus('error');
        setMessage('Invalid verification link. Please try signing up again.');
        return;
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          setStatus('error');
          setMessage(error.message || 'Verification failed. Please try again.');
        } else {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          
          toast({
            title: "Email verified!",
            description: "You can now access all features of ResumeAI.",
          });

          // Redirect after a short delay
          setTimeout(() => {
            navigate(redirect_to || '/');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate, toast]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-brand-cyan animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying your email...';
      case 'success':
        return 'Email verified!';
      case 'error':
        return 'Verification failed';
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl text-white">{getTitle()}</CardTitle>
          <CardDescription className="text-gray-300">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'success' && (
            <p className="text-sm text-gray-300">
              Redirecting you to the app in a moment...
            </p>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/auth')}
                className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black"
              >
                <Mail className="mr-2 h-4 w-4" />
                Try signing up again
              </Button>
            </div>
          )}
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationStatus;
