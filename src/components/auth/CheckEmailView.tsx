
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

interface CheckEmailViewProps {
  email: string;
  onBackToSignIn: () => void;
}

const CheckEmailView: React.FC<CheckEmailViewProps> = ({ email, onBackToSignIn }) => {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mail className="h-12 w-12 text-brand-cyan" />
                <CheckCircle className="h-5 w-5 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Check your email!</CardTitle>
            <CardDescription className="text-gray-300">
              We've sent a confirmation link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-300">
                Click the link in the email to verify your account and get started with ResumeAI.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  💡 Tip: Check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={onBackToSignIn}
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
    </div>
  );
};

export default CheckEmailView;
