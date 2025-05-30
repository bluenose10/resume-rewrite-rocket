
export const sanitizeHtml = (html: string): string => {
  // Remove script tags and other potentially harmful content
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

export const convertHtmlToText = (html: string): string => {
  // Create a temporary div to convert HTML to text
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

export const isHtmlContent = (content: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(content);
};
