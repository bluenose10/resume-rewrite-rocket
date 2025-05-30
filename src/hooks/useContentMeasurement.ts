
import { useEffect, useState, useRef } from 'react';

interface ContentMeasurement {
  height: number;
  canSplit: boolean;
}

export const useContentMeasurement = () => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState<Map<string, ContentMeasurement>>(new Map());

  const measureContent = (content: React.ReactNode, key: string): Promise<ContentMeasurement> => {
    return new Promise((resolve) => {
      if (measurements.has(key)) {
        resolve(measurements.get(key)!);
        return;
      }

      const measureElement = document.createElement('div');
      measureElement.style.position = 'absolute';
      measureElement.style.visibility = 'hidden';
      measureElement.style.width = '794px';
      measureElement.style.padding = '24px';
      measureElement.className = 'bg-white text-gray-900';
      
      // Create a temporary React root to render content
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(measureElement);
      document.body.appendChild(tempContainer);

      // Simulate the content rendering
      setTimeout(() => {
        const rect = measureElement.getBoundingClientRect();
        const measurement: ContentMeasurement = {
          height: rect.height || 100, // fallback height
          canSplit: measureElement.children.length > 1
        };
        
        setMeasurements(prev => new Map(prev).set(key, measurement));
        document.body.removeChild(tempContainer);
        resolve(measurement);
      }, 0);
    });
  };

  return { measureContent, measurements };
};
