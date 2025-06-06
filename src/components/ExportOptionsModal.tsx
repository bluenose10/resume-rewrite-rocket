
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Image, Printer, Loader2 } from 'lucide-react';
import { ExportOptions } from '@/types/export';
import { useResumeStats } from '@/hooks/useResumeStats';
import { toast } from 'sonner';

interface ExportOptionsModalProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({ onExport, isExporting }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    quality: 'high',
    paperSize: 'a4',
    margins: 'medium'
  });
  const [isOpen, setIsOpen] = useState(false);
  const { incrementResumeCount } = useResumeStats();

  const handleExport = async () => {
    try {
      toast.loading('Generating your resume...', { id: 'export-progress' });
      await onExport(options);
      
      // Increment resume count after successful export
      try {
        await incrementResumeCount();
        console.log('Resume count incremented successfully');
      } catch (countError) {
        console.error('Failed to increment resume count:', countError);
        // Don't show error to user as export was successful
      }
      
      setIsOpen(false);
      toast.success('Resume exported successfully!', { id: 'export-progress' });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export resume. Please try again.', { id: 'export-progress' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Your Resume
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <RadioGroup
              value={options.format}
              onValueChange={(value) => setOptions({ ...options, format: value as any })}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="cursor-pointer flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                <RadioGroupItem value="png" id="png" disabled />
                <Label htmlFor="png" className="cursor-not-allowed flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  PNG
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                <RadioGroupItem value="jpeg" id="jpeg" disabled />
                <Label htmlFor="jpeg" className="cursor-not-allowed flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  JPEG
                </Label>
              </div>
            </RadioGroup>
            {options.format !== 'pdf' && (
              <p className="text-xs text-amber-500 mt-2">
                Image formats will be available soon. Please use PDF for now.
              </p>
            )}
          </div>

          {/* Quality Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Export Quality</Label>
            <Select
              value={options.quality}
              onValueChange={(value) => setOptions({ ...options, quality: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (Faster)</SelectItem>
                <SelectItem value="high">High Quality (Recommended)</SelectItem>
                <SelectItem value="ultra">Ultra Quality (Slower)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paper Size (for PDF only) */}
          {options.format === 'pdf' && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Paper Size</Label>
              <Select
                value={options.paperSize}
                onValueChange={(value) => setOptions({ ...options, paperSize: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="legal">Legal (8.5 × 14 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Margins (for PDF only) */}
          {options.format === 'pdf' && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Margins</Label>
              <Select
                value={options.margins}
                onValueChange={(value) => setOptions({ ...options, margins: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Margins</SelectItem>
                  <SelectItem value="small">Small (5mm)</SelectItem>
                  <SelectItem value="medium">Medium (10mm)</SelectItem>
                  <SelectItem value="large">Large (15mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                `Export as ${options.format.toUpperCase()}`
              )}
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportOptionsModal;
