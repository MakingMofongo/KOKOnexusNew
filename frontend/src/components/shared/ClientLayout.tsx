'use client'

import React from 'react'
import { Navigation } from './Navigation'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
} 