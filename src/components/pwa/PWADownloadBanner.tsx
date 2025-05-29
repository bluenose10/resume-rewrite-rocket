
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { usePWA } from '@/hooks/use-pwa';
import PWAInstallPrompt from './PWAInstallPrompt';

interface PWADownloadBannerProps {
  className?: string;
}

const PWADownloadBanner: React.FC<PWADownloadBannerProps> = ({ className = '' }) => {
  const { isStandalone, canInstall } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  if (isStandalone || !canInstall) {
    return null;
  }

  return (
    <>
      <div className={`inline-block ${className}`}>
        <Button 
          onClick={() => setShowInstallPrompt(true)}
          variant="outline" 
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Our App
        </Button>
      </div>
      
      {showInstallPrompt && (
        <PWAInstallPrompt 
          isOpen={showInstallPrompt}
          onClose={() => setShowInstallPrompt(false)}
        />
      )}
    </>
  );
};

export default PWADownloadBanner;
