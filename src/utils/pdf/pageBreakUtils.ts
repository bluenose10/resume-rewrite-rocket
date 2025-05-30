
export const addPageBreakStyles = (): HTMLElement => {
  const style = document.createElement('style');
  style.id = 'page-break-styles';
  style.textContent = `
    .resume-section {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 24px;
    }
    
    .resume-item {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 16px;
    }
    
    .page-break-before {
      page-break-before: always !important;
      break-before: page !important;
    }
    
    .page-break-after {
      page-break-after: always !important;
      break-after: page !important;
    }
    
    .page-break-inside-avoid {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    .no-page-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    .resume-page {
      page-break-after: always !important;
      break-after: page !important;
    }
    
    .resume-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }
    
    @media print {
      .no-print {
        display: none !important;
      }
      
      .resume-page {
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  `;
  
  // Remove existing style if present
  const existing = document.getElementById('page-break-styles');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(style);
  return style;
};

export const removePageBreakStyles = (style: HTMLElement): void => {
  if (style && style.parentNode) {
    style.parentNode.removeChild(style);
  }
};

export const optimizeResumeForPrint = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add enhanced print-specific styles
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      #${elementId} {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 20mm !important;
        width: 100% !important;
        max-width: none !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
      }
      
      #${elementId} section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 16px !important;
      }
      
      #${elementId} .space-y-3 > div,
      #${elementId} .space-y-2 > div {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 12px !important;
      }
      
      #${elementId} * {
        visibility: visible !important;
      }
      
      #${elementId} .no-print {
        display: none !important;
      }
      
      #${elementId} .page-break-indicator {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
};
