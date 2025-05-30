
import React, { useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "100px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      let newContent = editorRef.current.innerHTML;
      // Convert div tags to p tags for better compatibility
      newContent = newContent.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');
      onChange(newContent);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      let newContent = editorRef.current.innerHTML;
      // Convert div tags to p tags for better compatibility
      newContent = newContent.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>');
      onChange(newContent);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Convert plain text to HTML if needed
  const getDisplayValue = () => {
    if (!value) return '';
    
    // If value doesn't contain HTML tags, convert line breaks to <p> tags
    if (!value.includes('<')) {
      // Split by double line breaks for paragraphs, single line breaks for <br>
      const paragraphs = value.split('\n\n').filter(p => p.trim() !== '');
      if (paragraphs.length > 1) {
        return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      } else {
        return `<p>${value.replace(/\n/g, '<br>')}</p>`;
      }
    }
    
    return value;
  };

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        padding: '8px', 
        backgroundColor: '#f9fafb', 
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => execCommand('bold')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontStyle: 'italic'
          }}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'p')}
          style={{
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Paragraph"
        >
          ¶
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: getDisplayValue() }}
        style={{
          minHeight,
          padding: '12px',
          outline: 'none',
          lineHeight: '1.5',
          fontSize: '14px',
          backgroundColor: 'white'
        }}
        data-placeholder={placeholder}
      />
      
      <style>
        {`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;
