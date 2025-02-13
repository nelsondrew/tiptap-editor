import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Color from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import FontFamily from '@tiptap/extension-font-family'
import Gapcursor from '@tiptap/extension-gapcursor'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import styled from 'styled-components'

const EditorContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  
  .ProseMirror {
    min-height: 200px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: #4a9eff;
    }
    
    > * + * {
      margin-top: 0.75em;
    }
    
    ul, ol {
      padding: 0 1rem;
    }
    
    h1, h2, h3, h4, h5, h6 {
      line-height: 1.1;
    }
    
    code {
      background-color: #e9ecef;
      padding: 0.2em 0.4em;
      border-radius: 4px;
    }
    
    pre {
      background: #0d0d0d;
      color: #fff;
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
    }
    
    blockquote {
      padding-left: 1rem;
      border-left: 2px solid #ddd;
    }
    
    hr {
      border: none;
      border-top: 2px solid #ddd;
      margin: 2rem 0;
    }
  }
`

const MenuBar = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`

const Button = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.active ? '#e9ecef' : 'white'};
  cursor: pointer;
  
  &:hover {
    background: #e9ecef;
  }
`

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Blockquote,
      Bold,
      BulletList,
      Code,
      CodeBlock,
      Color,
      Document,
      Dropcursor,
      FontFamily,
      Gapcursor,
      Heading,
      Highlight,
      History,
      HorizontalRule,
      Image,
      Italic,
      Link,
      ListItem,
      OrderedList,
      Paragraph,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      Strike,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({
        nested: true,
      }),
      TaskList,
      Text,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Typography,
      Underline,
    ],
    content: '<p>Hello World! 🌎</p>',
  })

  if (!editor) {
    return null
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
      </MenuBar>
      <EditorContent editor={editor} />
    </EditorContainer>
  )
}

export default TipTapEditor 