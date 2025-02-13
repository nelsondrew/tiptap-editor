import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ResizableChart } from '../ResizableChart'

export const ChartExtension = Node.create({
  name: 'chart',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      alignment: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-alignment') || 'center',
        renderHTML: attributes => ({
          'data-alignment': attributes.alignment,
        }),
      },
      width: {
        default: '100%',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
      height: {
        default: 200,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => ({
          height: attributes.height,
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="chart"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'chart', ...HTMLAttributes }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableChart)
  },
}) 