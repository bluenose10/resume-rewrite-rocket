// Simple HTML sanitizer for rich text content
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Allow only specific tags
  const allowedTags = ['b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'br', 'p'];
  const walker = document.createTreeWalker(
    div,
    NodeFilter.SHOW_ELEMENT,
    null
  );
  
  const elementsToRemove: Element[] = [];
  let node = walker.nextNode();
  
  while (node) {
    const element = node as Element;
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      elementsToRemove.push(element);
    }
    node = walker.nextNode();
  }
  
  // Remove disallowed elements but keep their content
  elementsToRemove.forEach(element => {
    const parent = element.parentNode;
    if (parent) {
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    }
  });
  
  return div.innerHTML;
};

// Convert plain text to HTML (for backward compatibility)
export const textToHtml = (text: string): string => {
  if (!text) return '';
  
  // If it already contains HTML tags, return as is
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return sanitizeHtml(text);
  }
  
  // Convert plain text to HTML
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('');
};

// Convert HTML to plain text (for fallback)
export const htmlToText = (html: string): string => {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};
