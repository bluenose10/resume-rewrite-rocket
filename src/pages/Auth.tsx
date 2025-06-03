
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import AuthHeader from '@/components/auth/AuthHeader';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import CheckEmailView from '@/components/auth/CheckEmailView';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { signIn, signUp, user } = useAuth();
  const { sendConfirmationEmail } = useEmailConfirmation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Account created successfully, attempting to send confirmation email...');

      // Send confirmation email and handle response properly
      toast({
        title: "Sending confirmation email...",
        description: "Please wait while we send your confirmation email."
      });

      const emailResult = await sendConfirmationEmail(email, fullName);
      
      if (emailResult.success) {
        console.log('Confirmation email sent successfully');
        toast({
          title: "Account created successfully!",
          description: "Please check your email to confirm your account."
        });
        setSubmittedEmail(email);
        setShowCheckEmail(true);
      } else {
        console.error('Confirmation email failed:', emailResult.error);
        
        // Provide specific error messages based on error codes
        let errorMessage = "We couldn't send the confirmation email. Please try resending it.";
        if (emailResult.error?.includes('DOMAIN_NOT_VERIFIED')) {
          errorMessage = "Email service configuration issue. Please contact support.";
        } else if (emailResult.error?.includes('MISSING_API_KEY')) {
          errorMessage = "Email service not configured. Please contact support.";
        }
        
        toast({
          title: "Account created but email failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        // Still show the check email view so user can try to resend
        setSubmittedEmail(email);
        setShowCheckEmail(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred during sign up",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showCheckEmail) {
    return (
      <CheckEmailView 
        email={submittedEmail}
        onBackToSignIn={() => setShowCheckEmail(false)}
      />
    );
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Background decorations matching home page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-10 sm:top-20 -left-10 sm:-left-20 w-30 sm:w-60 h-30 sm:h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
      </div>

      <AuthHeader />

      {/* Main auth content */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism auth card */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Welcome</CardTitle>
              <CardDescription className="text-gray-300">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                  <TabsTrigger 
                    value="signin" 
                    className="text-white data-[state=active]:bg-brand-cyan data-[state=active]:text-black"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="text-white data-[state=active]:bg-brand-cyan data-[state=active]:text-black"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="signup">
                  <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
