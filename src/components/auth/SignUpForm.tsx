
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password, formData.fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-fullname" className="text-white">Full Name</Label>
        <Input
          id="signup-fullname"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-brand-cyan"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-white">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
  );
};

export default SignUpForm;
