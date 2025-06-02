
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePremiumTemplates } from '@/hooks/usePremiumTemplates';
import { Loader2 } from 'lucide-react';

const PremiumTemplateGallery: React.FC = () => {
  const { templates, isLoading } = usePremiumTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading premium templates...</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No premium templates available yet. Upload some templates to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={template.image_url}
              alt={template.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {template.description}
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              {template.category && (
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              )}
              {template.industry && (
                <Badge variant="outline" className="text-xs">
                  {template.industry}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PremiumTemplateGallery;
