'use client'

import { Resizable } from 're-resizable'
import { NodeViewWrapper } from '@tiptap/react'
import styled from 'styled-components'

const ChartContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: ${props => {
    switch (props.alignment) {
      case 'left': return 'flex-start'
      case 'right': return 'flex-end'
      default: return 'center'
    }
  }};
`

const Chart = styled.div`
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #64748b;
  min-height: 100px;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  cursor: pointer;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.ProseMirror-selectednode {
    border-color: #3b82f6;
    outline: 2px solid rgba(59, 130, 246, 0.2);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }
`

export const ResizableChart = ({ node, selected, updateAttributes }) => {
  const alignment = node.attrs.alignment || 'center'

  return (
    <NodeViewWrapper>
      <ChartContainer alignment={alignment}>
        <Resizable
          defaultSize={{
            width: node.attrs.width || '100%',
            height: node.attrs.height || 200,
          }}
          minHeight={100}
          minWidth={200}
          maxWidth="100%"
          enable={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            right: { 
              width: '8px',
              right: '-4px',
              cursor: 'ew-resize'
            },
            bottom: { 
              height: '8px',
              bottom: '-4px',
              cursor: 'ns-resize'
            },
            bottomRight: { 
              width: '12px',
              height: '12px',
              bottom: '-6px',
              right: '-6px',
              cursor: 'nwse-resize'
            },
          }}
          handleClasses={{
            right: 'resize-handle',
            bottom: 'resize-handle',
            bottomRight: 'resize-handle',
          }}
        >
          <Chart 
            className={selected ? 'ProseMirror-selectednode' : ''}
          >
            Chart
          </Chart>
        </Resizable>
      </ChartContainer>
    </NodeViewWrapper>
  )
} 