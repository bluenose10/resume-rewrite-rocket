
import { useEffect, useState, useRef } from 'react';

interface ContentMeasurement {
  height: number;
  canSplit: boolean;
}

export const useContentMeasurement = () => {
  const [measurements, setMeasurements] = useState<Map<string, ContentMeasurement>>(new Map());

  const measureContent = (content: React.ReactNode, key: string): Promise<ContentMeasurement> => {
    return new Promise((resolve) => {
      if (measurements.has(key)) {
        resolve(measurements.get(key)!);
        return;
      }

      // Fallback to estimated heights to avoid DOM manipulation issues
      const fallbackMeasurement: ContentMeasurement = {
        height: 150, // reasonable default height
        canSplit: true
      };
      
      setMeasurements(prev => new Map(prev).set(key, fallbackMeasurement));
      resolve(fallbackMeasurement);
    });
  };

  return { measureContent, measurements };
};
