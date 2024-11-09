import React from 'react'
import { DeploymentProgress } from '@/components/deploy/DeploymentProgress'

export default function DeploymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8 pt-24">
        <DeploymentProgress />
        {children}
      </div>
    </div>
  )
} 