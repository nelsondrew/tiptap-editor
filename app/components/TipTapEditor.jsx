'use client'

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import { SlashCommand, getSuggestionItems, renderItems } from './extensions/SlashCommand'
import styled from 'styled-components'
import 'tippy.js/dist/tippy.css'
import { useRef, useCallback, useEffect, useState } from 'react'
import { ImageResizeWrapper } from './ImageResizeWrapper'
import { ImagePlaceholder } from './ImagePlaceholder'
import { ImagePlaceholderExtension } from './extensions/ImagePlaceholderExtension'
import { ChartExtension } from './extensions/ChartExtension'
import { ChartBubbleMenu } from './ChartBubbleMenu'

const EditorContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid #374151;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  
  .ProseMirror {
    min-height: 200px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    color: #1f2937;
    
    &:focus {
      outline: none;
      border-color: #2563eb;
      ring: 2px rgba(37, 99, 235, 0.2);
    }
    
    > * + * {
      margin-top: 0.75em;
    }
    
    ul, ol {
      padding: 0 1rem;
    }
    
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.1;
      color: #111827;
    }
    
    code {
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      color: #111827;
    }
    
    pre {
      background: #1f2937;
      color: #f3f4f6;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      
      code {
        color: inherit;
        padding: 0;
        background: none;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
      &.ProseMirror-selectednode {
        outline: 3px solid #68cef8;
      }
      
      &.resizable-image {
        display: inline-block;
        position: relative;
        margin: 1rem 0;
      }
    }
    
    .image-resizer {
      display: inline-block;
      position: relative;
      margin: 1rem 0;

      img {
        max-width: 100%;
        height: auto;
        transition: all 0.1s ease;
      }

      &.ProseMirror-selectednode img {
        outline: 3px solid #68cef8;
      }
    }
    
    blockquote {
      padding-left: 1rem;
      border-left: 4px solid #e5e7eb;
      color: #4b5563;
    }
    
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 2rem 0;
    }

    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td, th {
        border: 2px solid #e5e7eb;
        box-sizing: border-box;
        min-width: 1em;
        padding: 8px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #f9fafb;
        font-weight: bold;
        text-align: left;
      }
    }

    div[data-type="chart"] {
      padding: 1rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-weight: 500;
      color: #475569;
      text-align: center;

      &.ProseMirror-selectednode {
        outline: 2px solid #3b82f6;
      }

      position: relative;
      
      .react-resizable-handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #3b82f6;
        border: 1px solid white;
        border-radius: 4px;
        z-index: 100;
        
        &:hover {
          background-color: #2563eb;
        }
      }
    }

    .resize-handle {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #3b82f6;
      border: 1px solid white;
      border-radius: 4px;
      z-index: 100;

      &:hover {
        background-color: #2563eb;
      }
    }
  }
`

const MenuBar = styled.div`
  padding: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 6px 6px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  
  .table-buttons {
    display: flex;
    gap: 6px;
    padding-left: 12px;
    margin-left: 12px;
    border-left: 1px solid #e5e7eb;
  }

  .chart-controls {
    display: flex;
    gap: 4px;
    padding: 0 8px;
    border-left: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    margin: 0 8px;
  }
`

const Button = styled.button`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: ${props => props.active ? '#e5e7eb' : '#ffffff'};
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    ring: 2px rgba(37, 99, 235, 0.2);
  }
  
  &:active {
    background: #e5e7eb;
  }
  
  ${props => props.active && `
    background: #e5e7eb;
    border-color: #9ca3af;
    color: #111827;
  `}
`

// Add file input for image upload
const HiddenInput = styled.input`
  display: none;
`

const TipTapEditor = () => {
  const [isMounted, setIsMounted] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleImageUpload = useCallback(async (file) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size should be less than 5MB')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      return data.url // The URL will be relative (/uploads/filename)
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error // Re-throw to handle in the calling function
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable any extensions that might cause SSR issues
        heading: {
          levels: [1, 2]
        }
      }),
      Color,
      FontFamily,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: 'resizable-image',
        },
        resizable: true,
        allowBase64: true,
        nodeViewRenderer: ReactNodeViewRenderer(ImageResizeWrapper),
      }),
      Link,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'my-custom-table',
        },
      }),
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Typography,
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
      ImagePlaceholderExtension.configure({
        immediatelyRender: false,
      }),
      ChartExtension,
    ],
    editable: true,
    injectCSS: false,
    content: '<p>Type / for commands</p>',
    editorProps: {
      handleDrop: async (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            try {
              const url = await handleImageUpload(file)
              if (url) {
                const { tr } = view.state
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })
                if (pos) {
                  view.dispatch(tr.insert(pos.pos, editor.schema.nodes.image.create({ src: url })))
                }
              }
            } catch (error) {
              console.error('Error uploading dropped image:', error)
              alert(error.message || 'Failed to upload image')
            }
            return true
          }
        }
        return false
      },
      handlePaste: async (view, event) => {
        if (event.clipboardData?.files?.length) {
          const file = event.clipboardData.files[0]
          if (file.type.startsWith('image/')) {
            try {
              const url = await handleImageUpload(file)
              if (url) {
                editor.chain().focus().setImage({ src: url }).run()
              }
            } catch (error) {
              console.error('Error uploading pasted image:', error)
              alert(error.message || 'Failed to upload image')
            }
            return true
          }
        }
        return false
      },
    },
    onCreate() {
      setIsMounted(true)
    },
  })

  const handleImageAdd = async (source) => {
    if (!editor) return

    try {
      if (typeof source === 'string') {
        // It's a URL
        await editor.chain()
          .focus()
          .setImage({ src: source })
          .deleteSelection()
          .run()
      } else {
        // It's a file
        const url = await handleImageUpload(source)
        if (url) {
          await editor.chain()
            .focus()
            .setImage({ src: url })
            .deleteSelection()
            .run()
        }
      }
    } catch (error) {
      console.error('Error handling file:', error)
      alert(error.message || 'Failed to upload image')
    }
  }

  // Don't render until client-side
  if (!isMounted) {
    return null
  }

  if (!editor) {
    return null
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <EditorContainer>
      <MenuBar>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          Strike
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          Code
        </Button>
        <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear Marks
        </Button>
        <Button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear Nodes
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
        >
          Paragraph
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          H1
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          Bullet List
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          Ordered List
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
        >
          Code Block
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          Blockquote
        </Button>
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal Rule
        </Button>
        <div className="table-buttons">
          <Button
            onClick={insertTable}
            title="Insert Table"
          >
            Insert Table
          </Button>
          <Button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.can().addColumnBefore()}
          >
            Add Column Before
          </Button>
          <Button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
          >
            Add Column After
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
          >
            Delete Column
          </Button>
          <Button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.can().addRowBefore()}
          >
            Add Row Before
          </Button>
          <Button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
          >
            Add Row After
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
          >
            Delete Row
          </Button>
          <Button
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
          >
            Delete Table
          </Button>
        </div>
        <Button onClick={() => {
          editor.chain().focus().insertContent({
            type: 'imagePlaceholder',
            attrs: {
              onImageAdd: handleImageAdd
            }
          }).run()
        }}>
          Add Image
        </Button>
      </MenuBar>
      {editor && <ChartBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </EditorContainer>
  )
}

export default TipTapEditor 