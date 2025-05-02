"use client";

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';

export type ToolName = 'paragraph' | 'header' | 'list' | 'checklist';
interface EditorWrapperProps {
  holderId: string;
  tools: ToolName[];
  onChange?: (data: OutputData) => void;
  initialData?: OutputData;
  debug?: boolean;
}

export default function EditorWrapper({
  holderId,
  tools,
  onChange,
  initialData,
  debug = false,
}: EditorWrapperProps) {
  const editorInstance = useRef<EditorJS | null>(null);

  // Destroy editor on unmount
  useEffect(() => {
    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  // Initialize editor when component mounts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('EditorWrapper: Window is undefined, cannot initialize Editor.js');
      return;
    }

    // Don't initialize twice
    if (editorInstance.current) return;

    // Make sure the holder element exists
    const holder = document.getElementById(holderId);
    if (!holder) {
      console.error(`Editor holder element with id ${holderId} not found`);
      return;
    }

    // Dynamically import tools
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolMap: Record<string, any> = {};
      for (const tool of tools) {
        switch (tool) {
          case 'paragraph':
            toolMap.paragraph = (await import('@editorjs/paragraph')).default;
            break;
          case 'header':
            toolMap.header = (await import('@editorjs/header')).default;
            break;
          case 'list':
            toolMap.list = (await import('@editorjs/list')).default;
            break;
          case 'checklist':
            toolMap.checklist = (await import('@editorjs/checklist')).default;
            break;
        }
      }
      if (debug) {
        console.log('Loaded Editor.js tools:', toolMap);
      }
      // Initialize a new instance of EditorJS
      const editor = new EditorJS({
        holder: holderId,
        tools: toolMap,
        data: initialData,
        autofocus: true,
        onChange: async () => {
          if (onChange) {
            try {
              const savedData = await editor.save();
              if (debug) console.log('Editor onChange data:', savedData);
              onChange(savedData);
            } catch (error) {
              console.error('Editor onChange error:', error);
            }
          }
        },
        onReady: () => {
          if (debug) console.log('Editor.js is ready!');
          // Focus editor when it's ready
          setTimeout(() => {
            try {
              // Attempt to focus the editor
              const editorElement = document.querySelector(`#${holderId} .ce-paragraph`);
              if (editorElement) {
                // Focus the paragraph block
                (editorElement as HTMLElement).click();
                // Set cursor to the end
                const selection = window.getSelection();
                const range = document.createRange();
                if (selection && editorElement.firstChild) {
                  range.setStart(editorElement.firstChild, editorElement.textContent?.length || 0);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
                console.log('Editor focused successfully');
              }
            } catch (e) {
              console.warn('Could not focus editor:', e);
            }
          }, 100);
        },
      });
      editorInstance.current = editor;
    })();
  }, [holderId, tools, initialData, onChange, debug]);

  // Return nothing - we're just initializing EditorJS
  return null;
} 