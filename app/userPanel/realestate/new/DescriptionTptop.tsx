// components/TiptapEditor.tsx
"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import '@/app/css/articls.css'
import '@/app/css/fileDetile.css'
import '@/app/css/tiptap-editor.css'

interface TiptapEditorProps {
    initialContent?: string;
    onChange: any;
    category?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ initialContent = '', onChange , category }) => {
    // console.log('initialContent : ', initialContent + ' - initialContent type : ', typeof(initialContent))
    
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Bold,
            Italic,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Heading.configure({ levels: [1, 2, 3] }),
            Paragraph,
        ],
        content: '',
        onUpdate: ({ editor }) => {
            onChange(category, editor.getHTML());
        },
        editorProps: {
            attributes: {
                // برای استایل مستقیم ادیتور با Tailwind
                // این کلاس‌ها به عنصر اصلی ویرایشگر (contenteditable) اعمال می‌شوند
                class: 'prose prose-lg focus:outline-none w-full min-h-[200px] p-4 description', // مثال: استایل محتوا
            },
        },
        immediatelyRender: false,
    });

    // Update editor content when initialContent changes
    useEffect(() => {
        if (editor && initialContent !== undefined) {
            // Only update if the content is different to avoid cursor issues
            if (editor.getHTML() !== initialContent) {
                editor.commands.setContent(initialContent); // false = don't trigger update event
            }
        }
    }, [editor, initialContent]);

    if (!editor) {
        // می‌تونید اینجا یک لودر یا کامپوننت Skeleton نمایش بدید
        return <div className="w-full h-[200px] bg-gray-200 rounded-md animate-pulse"></div>;
    }

    return (
        <div className="articlsSty  tiptap-editor-container shadow-[var(--blackshadow)] rounded-lg overflow-hidden shadow-sm">
            <EditorMenu editor={editor} category={category} /> {/* category را هم پاس می‌دهیم اگر لازم باشد */}
            <EditorContent 
                editor={editor} 
                className="description articlsSty bg-[var(--inputback)] border-t border-white/50 rounded-b-lg p-4 min-h-[400px] prose prose-lg max-w-none" 
            />
        </div>
    );
};

interface EditorMenuProps {
    editor: Editor;
    category?: string; // اگر لازم بود
}

const EditorMenu: React.FC<EditorMenuProps> = ({ editor, category }) => {
    // Helper function to toggle formatting
    const toggleFormat = (command: string, options?: any) => {
        (editor.chain().focus() as any)[command](options).run();
    };

    // Helper function to check if a format is active
    const isActive = (type: string, options?: any): boolean => {
        return editor.isActive(type, options);
    };

    // Helper function to set text color
    const setColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
    };

    // Define available colors
    const colors = [
        { name: 'black', value: '#000000' },
        { name: 'red', value: '#ef4444' },
        { name: 'blue', value: '#3b82f6' },
        { name: 'green', value: '#10b981' },
        { name: 'yellow', value: '#eab308' },
        { name: 'purple', value: '#a855f7' },
        { name: 'orange', value: '#f97316' },
    ];

    return (
        <div className="editor-menu bg-[var(--inputback)] rounded-t-lg p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            {/* Bold */}
            <button
                onClick={() => toggleFormat('toggleBold')}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('Bold') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <b className="text-sm">B</b>
            </button>

            {/* Italic */}
            <button
                onClick={() => toggleFormat('toggleItalic')}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('Italic') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <i className="text-sm">I</i>
            </button>

            {/* Underline */}
            <button
                onClick={() => toggleFormat('toggleUnderline')}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('Underline') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <ins className="text-sm no-underline">U</ins> {/* Tailwind 'no-underline' برای جلوگیری از تداخل */}
            </button>

            {/* Headings */}
            {/* <button
                onClick={() => toggleFormat('toggleHeading', { level: 1 })}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('H1') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <span className="text-sm font-bold">H1</span>
            </button> */}
            <button
                onClick={() => toggleFormat('toggleHeading', { level: 2 })}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('H2') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <span className="text-sm font-semibold">H2</span>
            </button>
             <button
                onClick={() => toggleFormat('toggleHeading', { level: 3 })}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('H3') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <span className="text-sm font-medium">H3</span>
            </button>

            {/* Paragraph */}
            <button
                onClick={() => toggleFormat('setParagraph')}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('Paragraph') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <span className="text-sm">P</span>
            </button>

            {/* Color Picker */}
            <div className="flex gap-1 border-l border-gray-300 pl-2">
                {colors.map((color) => (
                    <button
                        key={color.name}
                        onClick={() => setColor(color.value)}
                        className={`rounded cursor-pointer w-[30px] h-[40px] transition border-2 ${
                            editor.getAttributes('textStyle').color === color.value
                                ? 'border-[var(--title)]'
                                : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    />
                ))}
            </div>

            {/* Link */}
            <button
                onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) {
                        toggleFormat('setLink', { href: url });
                    }
                }}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('bold') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-2.829 2.829a4 4 0 000 5.656 4 4 0 005.656 0l2.829-2.829a4 4 0 000-5.656z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l2.829-2.829a4 4 0 000-5.656 4 4 0 00-5.656 0l-2.829 2.829a4 4 0 000 5.656z"></path></svg>
            </button>
             <button
                onClick={() => toggleFormat('unsetLink')}
                className={`rounded  cursor-pointer w-[40px] h-[40px] ccdiv transition text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] ${isActive('bold') ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`}
                disabled={!isActive('link')} // غیرفعال کردن دکمه اگر لینکی فعال نباشد
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-2.829 2.829a4 4 0 000 5.656 4 4 0 005.656 0l2.829-2.829a4 4 0 000-5.656z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l2.829-2.829a4 4 0 000-5.656 4 4 0 00-5.656 0l-2.829 2.829a4 4 0 000 5.656z"></path></svg>
            </button>
        </div>
    );
};

export default TiptapEditor;
