import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailConfirmation } from '@/hooks/useEmailConfirmation';
import { Loader2, Eye, EyeOff, FileText, ArrowLeft, Sparkles, Mail, CheckCircle } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSignUpAction, setIsSignUpAction] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', fullName: '' });
  const { signIn, signUp, user } = useAuth();
  const { sendConfirmationEmail } = useEmailConfirmation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Send confirmation email through our custom function
        const emailResult = await sendConfirmationEmail(signupForm.email, signupForm.fullName);
        
        if (emailResult.success) {
          console.log('Custom confirmation email sent successfully');
        } else {
          console.warn('Custom confirmation email failed, but signup succeeded');
        }

        setSubmittedEmail(signupForm.email);
        setIsSignUpAction(true);
        setShowCheckEmail(true);
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showCheckEmail) {
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
                We've sent a confirmation link to {submittedEmail}
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
                  onClick={() => setShowCheckEmail(false)}
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

      {/* Header with brand logo and back button */}
      <header className="relative z-20 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-brand-cyan" />
          <span className="text-lg sm:text-xl font-bold text-white">ResumeAI</span>
        </div>
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </header>

      {/* Main auth content */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="w-full max-w-md">
          {/* Welcome badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-white/10 text-white border-white/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Join thousands of professionals
            </div>
          </div>

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
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-white">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-300 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold glow-cyan" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname" className="text-white">Full Name</Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.fullName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          minLength={6}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-300 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-300">Password must be at least 6 characters</p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold glow-cyan" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </form>
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
