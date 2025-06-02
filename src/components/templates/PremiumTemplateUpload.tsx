
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { usePremiumTemplates } from '@/hooks/usePremiumTemplates';
import { toast } from 'sonner';

const PremiumTemplateUpload: React.FC = () => {
  const { uploadTemplate } = usePremiumTemplates();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    industry: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a template image');
      return;
    }

    if (!formData.name || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsUploading(true);
    try {
      await uploadTemplate(selectedFile, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        industry: formData.industry,
        is_active: true
      });

      toast.success('Template uploaded and analysis started!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        industry: ''
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('template-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload template');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Premium Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="template-file">Template Image (PNG, JPG, PDF)</Label>
            <Input
              id="template-file"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Modern Executive Resume"
              disabled={isUploading}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A clean, professional template perfect for executives..."
              disabled={isUploading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !selectedFile}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading & Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Template
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PremiumTemplateUpload;
