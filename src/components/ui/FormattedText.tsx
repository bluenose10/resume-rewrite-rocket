import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const FormattedText: React.FC<FormattedTextProps> = ({ 
  content, 
  className = '',
  style = {} 
}) => {
  // Basic HTML sanitization - remove potentially dangerous tags
  const sanitizeHtml = (html: string): string => {
    const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li'];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove all attributes and scripts
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    const elementsToRemove: Element[] = [];
    let node;
    
    while (node = walker.nextNode()) {
      const element = node as Element;
      
      // Remove disallowed tags
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        elementsToRemove.push(element);
      } else {
        // Remove all attributes from allowed tags
        Array.from(element.attributes).forEach(attr => {
          element.removeAttribute(attr.name);
        });
      }
    }
    
    // Remove disallowed elements but keep their text content
    elementsToRemove.forEach(element => {
      const textNode = document.createTextNode(element.textContent || '');
      element.parentNode?.replaceChild(textNode, element);
    });
    
    return tempDiv.innerHTML;
  };

  // If content is empty or just whitespace, return null
  if (!content || content.trim() === '') {
    return null;
  }

  // If content has no HTML tags, treat as plain text
  if (!content.includes('<')) {
    return (
      <div 
        className={className}
        style={{ whiteSpace: 'pre-line', ...style }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(content) 
      }}
    />
  );
};

export default FormattedText;
