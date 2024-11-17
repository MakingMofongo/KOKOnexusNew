import React from 'react'
import { Navigation } from '@/components/shared/Navigation'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FeaturesSection } from '@/components/marketing/FeaturesSection'
import { AudioDemoSection } from '@/components/marketing/AudioDemoSection'
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection'
import { PricingSection } from '@/components/marketing/PricingSection'
import { CTASection } from '@/components/marketing/CTASection'
import { Footer } from '@/components/shared/Footer'

export default function HomePage() {
  return (
    <main className="bg-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AudioDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
