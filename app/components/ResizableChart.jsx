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
  position: relative;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    & ~ .resize-handle {
      opacity: 0.5;
    }
  }

  &.ProseMirror-selectednode {
    border-color: #3b82f6;
    outline: 2px solid rgba(59, 130, 246, 0.2);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);

    & ~ .resize-handle {
      opacity: 1;
    }
  }
`

export const ResizableChart = ({ node, selected, updateAttributes }) => {
  const alignment = node.attrs.alignment || 'center'

  const handleResize = (e, direction, ref, d) => {
    // Keep selection during resize
    if (selected) {
      updateAttributes({ selected: true })
    }
  }

  const handleResizeStop = (e, direction, ref, d) => {
    updateAttributes({
      width: ref.style.width,
      height: ref.style.height,
      selected: true // Keep selection after resize
    })
  }

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
              width: '2px',
              right: '-1px',
              top: '0',
              bottom: '0',
              cursor: 'ew-resize',
              background: selected ? '#3b82f6' : '#e2e8f0',
              border: 'none',
              transition: 'all 0.2s ease',
              opacity: 0
            },
            bottom: { 
              height: '2px',
              bottom: '-1px',
              left: '0',
              right: '0',
              cursor: 'ns-resize',
              background: selected ? '#3b82f6' : '#e2e8f0',
              border: 'none',
              transition: 'all 0.2s ease',
              opacity: 0
            },
            bottomRight: { 
              width: '6px',
              height: '6px',
              bottom: '-2px',
              right: '-2px',
              cursor: 'nwse-resize',
              background: selected ? '#3b82f6' : '#e2e8f0',
              border: 'none',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              opacity: 0
            },
          }}
          handleClasses={{
            right: 'resize-handle',
            bottom: 'resize-handle',
            bottomRight: 'resize-handle',
          }}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
        >
          <Chart 
            className={selected ? 'ProseMirror-selectednode' : ''}
            data-type="chart"
            onClick={() => updateAttributes({ selected: true })}
          >
            Chart
          </Chart>
        </Resizable>
      </ChartContainer>
    </NodeViewWrapper>
  )
} 