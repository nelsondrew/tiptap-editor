'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import styled from 'styled-components'
import ToggleSwitch from '../../components/ToggleSwitch'

const TipTapEditor = dynamic(() => import('../components/TipTapEditor'), {
  ssr: false,
})

const Container = styled.div`
  margin: 5%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
`;

export default function TipTapPage() {
  const [editMode, setEditMode] = useState(false);

  return (
    <Container>
      <Header>
        <Title>TipTap Editor</Title>
        <ToggleSwitch 
          checked={editMode}
          onChange={setEditMode}
          label={editMode ? 'Edit Mode' : 'View Mode'}
        />
      </Header>
      <TipTapEditor editMode={editMode} />
    </Container>
  )
} 