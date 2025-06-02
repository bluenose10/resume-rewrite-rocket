
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileImage, Loader2 } from 'lucide-react';

const AdminTemplates = () => {
  const [file, setFile] = useState<File | null>(null);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: '',
    industry: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      if (uploadedFile.type.startsWith('image/') || uploadedFile.type === 'application/pdf') {
        setFile(uploadedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or PDF file",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type.startsWith('image/') || uploadedFile.type === 'application/pdf') {
        setFile(uploadedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or PDF file",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !templateData.name || !templateData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Supabase storage (we'll create this bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('premium-templates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('premium-templates')
        .getPublicUrl(fileName);

      // Save template metadata
      const { error: insertError } = await supabase
        .from('premium_templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          industry: templateData.industry,
          image_url: publicUrl
        });

      if (insertError) throw insertError;

      // Call AI analysis function
      const { error: analysisError } = await supabase.functions.invoke('analyze-template', {
        body: { 
          imageUrl: publicUrl, 
          templateName: templateData.name,
          category: templateData.category 
        }
      });

      if (analysisError) {
        console.warn('Template analysis failed:', analysisError);
        // Don't throw error here as template was saved successfully
      }

      toast({
        title: "Template uploaded successfully",
        description: "Template has been uploaded and analyzed for design patterns"
      });

      // Reset form
      setFile(null);
      setTemplateData({ name: '', description: '', category: '', industry: '' });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Template Manager</h1>
          <p className="text-gray-600">Upload premium templates for AI analysis and design pattern learning</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Premium Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <FileImage className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium">Drop template file here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-400">Supports: Images (JPG, PNG) and PDF files</p>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
              />
            </div>

            {/* Template Information Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Modern Professional CV"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={templateData.category} 
                  onValueChange={(value) => setTemplateData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={templateData.industry} 
                  onValueChange={(value) => setTemplateData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateData.description}
                onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template's style and best use cases..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !file || !templateData.name || !templateData.category}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Analyzing...
                </>
              ) : (
                'Upload Template'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTemplates;
