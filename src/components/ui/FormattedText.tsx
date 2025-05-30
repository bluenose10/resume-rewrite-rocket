
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
  // Debug logging to understand content processing
  console.log('FormattedText received content:', content);
  console.log('Content type:', typeof content);
  console.log('Content length:', content?.length);

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
    console.log('FormattedText: Empty content, returning null');
    return null;
  }

  // Improved HTML detection - check for common HTML patterns
  const hasHtml = content.includes('<') && (
    content.includes('<p>') || 
    content.includes('<br>') || 
    content.includes('<ul>') || 
    content.includes('<ol>') || 
    content.includes('<li>') || 
    content.includes('<strong>') || 
    content.includes('<b>') || 
    content.includes('<em>') || 
    content.includes('<i>')
  );

  console.log('FormattedText: Has HTML detected:', hasHtml);

  // If content has no HTML tags, treat as plain text
  if (!hasHtml) {
    console.log('FormattedText: Rendering as plain text with line breaks');
    return (
      <div 
        className={className}
        style={{ whiteSpace: 'pre-line', ...style }}
      >
        {content}
      </div>
    );
  }

  console.log('FormattedText: Rendering as HTML');
  const sanitizedContent = sanitizeHtml(content);
  console.log('FormattedText: Sanitized content:', sanitizedContent);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ 
        __html: sanitizedContent 
      }}
    />
  );
};

export default FormattedText;
