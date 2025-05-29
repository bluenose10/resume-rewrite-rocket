
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ isOpen, onClose }) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const checkInstalledPWA = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstallable(false);
      }
    };
    
    checkInstalledPWA();
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      toast.success('App successfully installed!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast.success('Thank you for installing Digital Gringo AI!');
    } else {
      toast.info('You can install the app later from the menu');
    }
    
    setInstallPrompt(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center">
            <Download className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl">Install Digital Gringo AI</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Get our resume builder app for faster access and offline use
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col p-2">
          {isIOS ? (
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-3">Install this app on your iOS device:</p>
              <ol className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="flex-shrink-0 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-6 w-6 mr-3 text-xs font-medium">1.</span>
                  <span>Tap the share button</span>
                </li>
                <li className="flex items-center">
                  <span className="flex-shrink-0 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-6 w-6 mr-3 text-xs font-medium">2.</span>
                  <span>Scroll down and tap Add to Home Screen</span>
                </li>
                <li className="flex items-center">
                  <span className="flex-shrink-0 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-6 w-6 mr-3 text-xs font-medium">3.</span>
                  <span>Tap Add in the top right corner</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-3">Install this app on your device:</p>
              <ol className="space-y-3 text-sm">
                <li className="flex items-center">
                  <span className="flex-shrink-0 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-6 w-6 mr-3 text-xs font-medium">1</span>
                  <span>Tap on the menu button</span>
                </li>
                <li className="flex items-center">
                  <span className="flex-shrink-0 inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-6 w-6 mr-3 text-xs font-medium">2</span>
                  <span>Select <strong>Add to Home Screen</strong></span>
                </li>
              </ol>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="sm:w-auto w-full order-1 sm:order-none"
          >
            Not now
          </Button>
          
          {isIOS ? (
            <Button 
              onClick={onClose} 
              className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Got it
            </Button>
          ) : (
            <Button 
              onClick={handleInstallClick}
              className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={!isInstallable}
            >
              <Download className="h-4 w-4" />
              Install App
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;
