
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PremiumTemplateUpload from '@/components/templates/PremiumTemplateUpload';
import PremiumTemplateGallery from '@/components/templates/PremiumTemplateGallery';

const TemplateManager: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Premium Template Manager
        </h1>
        <p className="text-gray-600">
          Upload and manage premium resume templates for AI analysis and design learning.
        </p>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload Template</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="mt-6">
          <PremiumTemplateGallery />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <PremiumTemplateUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateManager;
