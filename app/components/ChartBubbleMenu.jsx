'use client'

import { BubbleMenu } from '@tiptap/react'
import styled from 'styled-components'

const MenuContainer = styled.div`
  background: #2d3748;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 4px;
  display: flex;
  gap: 2px;
  z-index: 50;
`

const MenuButton = styled.button`
  background: ${props => props.active ? '#4a5568' : 'transparent'};
  border: none;
  border-radius: 4px;
  color: #e2e8f0;
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #4a5568;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
  }
`

export const ChartBubbleMenu = ({ editor }) => {
  if (!editor) return null

  const setAlignment = (alignment) => {
    editor.chain()
      .focus()
      .updateAttributes('chart', { alignment, selected: true })
      .run()
  }

  const currentAlignment = editor.getAttributes('chart').alignment || 'center'

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, state, from }) => {
        const node = state.doc.nodeAt(from)
        return node?.type.name === 'chart' && editor.isActive('chart')
      }}
      tippyOptions={{
        duration: 100,
        placement: 'top-start',
        offset: [0, -8],
        zIndex: 50,
        interactive: true,
        getReferenceClientRect: () => {
          const chartElement = document.querySelector('.ProseMirror-selectednode[data-type="chart"]')
          if (chartElement) {
            const rect = chartElement.getBoundingClientRect()
            return {
              width: rect.width,
              height: rect.height,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
            }
          }
          return null
        }
      }}
    >
      <MenuContainer>
        <MenuButton
          onClick={() => setAlignment('left')}
          active={currentAlignment === 'left'}
          title="Align left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => setAlignment('center')}
          active={currentAlignment === 'center'}
          title="Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MenuButton>
        <MenuButton
          onClick={() => setAlignment('right')}
          active={currentAlignment === 'right'}
          title="Align right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="9" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MenuButton>
      </MenuContainer>
    </BubbleMenu>
  )
} 