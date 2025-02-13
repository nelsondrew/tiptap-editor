'use client'

import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('../components/TipTapEditor'), {
  ssr: false,
})

export default function TipTapPage() {
  return (
    <div style={{
        margin: "5%"
    }}>
      <h1>TipTap Editor</h1>
      <TipTapEditor />
    </div>
  )
} 