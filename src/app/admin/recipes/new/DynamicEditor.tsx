"use client";

import dynamic from 'next/dynamic';
import type { OutputData } from '@editorjs/editorjs';

// Import EditorWrapper with SSR disabled
const EditorWrapper = dynamic(() => import('./EditorWrapper'), {
  ssr: false, // Critical: ensures loading only on client side
  loading: () => <div className="animate-pulse bg-muted/50 rounded h-64 flex items-center justify-center">Loading editor...</div>
});

interface DynamicEditorProps {
  holderId: string;
  tools: Record<string, any>;
  onChange?: (data: OutputData) => void;
  initialData?: OutputData;
  debug?: boolean;
}

export default function DynamicEditor({
  holderId,
  tools,
  onChange,
  initialData,
  debug = false
}: DynamicEditorProps) {
  // Create the holder div and load the EditorWrapper dynamically
  return (
    <div className="w-full">
      <div id={holderId} className="min-h-[200px]"></div>
      <EditorWrapper 
        holderId={holderId}
        tools={tools}
        onChange={onChange}
        initialData={initialData}
        debug={debug}
      />
    </div>
  );
} 