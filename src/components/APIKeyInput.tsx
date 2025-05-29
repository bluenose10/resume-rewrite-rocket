
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Key } from 'lucide-react';

interface APIKeyInputProps {
  onKeyChange: (key: string) => void;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      onKeyChange(savedKey);
    }
  }, [onKeyChange]);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('openai_api_key', value);
    onKeyChange(value);
  };

  const clearKey = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    onKeyChange('');
  };

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Key className="h-5 w-5" />
          OpenAI API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="apiKey" className="text-amber-800">
            OpenAI API Key
          </Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button onClick={clearKey} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </div>
        <div className="text-sm text-amber-700">
          <p>
            Your API key is stored locally in your browser and is only used to optimize your resume content. 
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-amber-900"
            >
              OpenAI Platform
            </a>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyInput;
