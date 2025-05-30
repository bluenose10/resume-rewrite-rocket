
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id
}) => {
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'bold', 'italic', 'list', 'bullet'
  ];

  return (
    <div className={cn("border rounded-md", className)}>
      <ReactQuill
        id={id}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          '--quill-border-color': 'rgb(226 232 240)',
          '--quill-font-size': '14px'
        } as React.CSSProperties}
      />
    </div>
  );
};

export { RichTextEditor };
