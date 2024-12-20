'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TemplateSelector } from '@/components/deploy/TemplateSelector'
import { VoiceSelector } from '@/components/deploy/VoiceSelector'
import { PhoneNumberSelector } from '@/components/deploy/PhoneNumberSelector'
import { DeploymentSummary } from '@/components/deploy/DeploymentSummary'
import { DeploymentProgress } from '@/components/deploy/DeploymentProgress'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { SPRING } from '@/lib/constants/animations'

export default function DeployPage() {
  const step = useDeploymentStore(state => state.step)

  console.log('DeployPage render:', { step })

  const renderStep = () => {
    switch (step) {
      case 'template':
        return <TemplateSelector />
      case 'voice':
        return <VoiceSelector />
      case 'number':
        return <PhoneNumberSelector />
      case 'deploy':
        console.log('Rendering DeploymentSummary')
        return <DeploymentSummary />
      default:
        return <TemplateSelector />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Only show progress bar if not in deploy step */}
        {step !== 'deploy' && <DeploymentProgress />}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <header className="text-center mb-12">
            <h1 className="heading-2 mb-4">
              {step === 'template' && 'Choose Your Assistant Template'}
              {step === 'voice' && 'Select Voice & Personality'}
              {step === 'number' && 'Set Up Phone Number'}
              {step === 'deploy' && 'Review & Deploy'}
            </h1>
            <p className="body-large">
              {step === 'template' && 'Start with a template or customize your own'}
              {step === 'voice' && 'Pick a voice that matches your brand'}
              {step === 'number' && 'Choose a number or port your existing one'}
              {step === 'deploy' && 'Review your configuration and deploy'}
            </p>
          </header>

          {renderStep()}
        </motion.div>
      </div>
    </div>
  )
} 