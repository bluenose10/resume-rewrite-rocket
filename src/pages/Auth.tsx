
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
  const { sendConfirmationEmail, testEmailFunction } = useEmailConfirmation();
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
        console.error('Sign in error:', error);
        
        // Handle specific error types
        let errorMessage = error.message;
        if (error.message?.includes('fetch')) {
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
        } else if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        }
        
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);

    try {
      console.log('=== STARTING SIGNUP PROCESS ===');
      console.log('Email:', email);
      console.log('Full name:', fullName);
      
      // First test if the email function is working
      console.log('Testing email function...');
      const testResult = await testEmailFunction();
      console.log('Test result:', testResult);
      
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific error types
        let errorMessage = error.message;
        if (error.message?.includes('fetch')) {
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
        } else if (error.message?.includes('already registered')) {
          errorMessage = "This email is already registered. Please try signing in instead.";
        } else if (error.message?.includes('Password should be')) {
          errorMessage = "Password must be at least 6 characters long.";
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      console.log('Account created successfully, attempting to send confirmation email...');

      // Account created successfully, now try to send confirmation email
      toast({
        title: "Account created!",
        description: "Sending confirmation email..."
      });

      try {
        console.log('Calling sendConfirmationEmail...');
        const emailResult = await sendConfirmationEmail(email, fullName);
        console.log('Email result:', emailResult);
        
        if (emailResult.success) {
          console.log('Confirmation email sent successfully');
          toast({
            title: "Success!",
            description: "Please check your email to confirm your account."
          });
        } else {
          console.error('Confirmation email failed:', emailResult.error);
          toast({
            title: "Account created",
            description: `Account created but we couldn't send the confirmation email: ${emailResult.error}`,
            variant: "destructive"
          });
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        toast({
          title: "Account created",
          description: "Account created but confirmation email failed. You can try to resend it.",
          variant: "destructive"
        });
      }
      
      // Always show the check email view after successful signup
      setSubmittedEmail(email);
      setShowCheckEmail(true);
      
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Sign up failed",
        description: "Network error. Please check your connection and try again.",
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
