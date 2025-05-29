
import { useState, useEffect } from 'react';

interface PWAStatus {
  isStandalone: boolean;
  canInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export function usePWA(): PWAStatus {
  const [status, setStatus] = useState<PWAStatus>({
    isStandalone: false,
    canInstall: false,
    isIOS: false,
    isAndroid: false
  });

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone || false;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    const canInstall = !isStandalone && (isIOS || isAndroid || 'serviceWorker' in navigator);
    
    setStatus({
      isStandalone,
      canInstall,
      isIOS,
      isAndroid
    });
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setStatus(prev => ({
        ...prev,
        isStandalone: e.matches
      }));
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return status;
}
