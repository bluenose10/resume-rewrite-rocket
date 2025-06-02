
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CheckEmailMessageProps {
  email: string;
  isSignUp?: boolean;
}

const CheckEmailMessage: React.FC<CheckEmailMessageProps> = ({ email, isSignUp = true }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: "Failed to resend email",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email sent!",
          description: "We've sent another confirmation email to your inbox."
        });
      }
    } catch (error) {
      toast({
        title: "Failed to resend email",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Mail className="h-12 w-12 text-brand-cyan" />
              <CheckCircle className="h-5 w-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            {isSignUp ? 'Check your email!' : 'Password reset sent!'}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isSignUp 
              ? `We've sent a confirmation link to ${email}`
              : `We've sent a password reset link to ${email}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-300">
              {isSignUp 
                ? "Click the link in the email to verify your account and get started with ResumeAI."
                : "Click the link in the email to reset your password."
              }
            </p>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-gray-400">
                💡 Tip: Check your spam folder if you don't see the email in your inbox.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend email
                </>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="w-full text-white hover:bg-white/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmailMessage;
