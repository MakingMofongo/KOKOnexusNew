import React from 'react'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturesSection } from '@/components/marketing/FeaturesSection'

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-bg">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
