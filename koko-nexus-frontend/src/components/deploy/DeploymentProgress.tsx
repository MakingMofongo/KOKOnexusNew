'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'

const steps = [
  { id: 'template', name: 'Select Template' },
  { id: 'voice', name: 'Choose Voice' },
  { id: 'number', name: 'Phone Number' },
  { id: 'deploy', name: 'Deploy' },
] as const

export function DeploymentProgress() {
  const currentStep = useDeploymentStore(state => state.step)
  const setStep = useDeploymentStore(state => state.setStep)

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className="mb-12">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[hsl(var(--purple-ghost))] -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-[hsl(var(--purple-main))] -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            {steps.map((step, index) => {
              const isComplete = index <= currentStepIndex
              const isCurrent = step.id === currentStep

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.button
                    className={`w-8 h-8 rounded-full flex items-center justify-center
                               ${isCurrent 
                                 ? 'bg-[hsl(var(--purple-main))] text-white'
                                 : isComplete
                                 ? 'bg-[hsl(var(--purple-main))] text-white'
                                 : 'bg-[hsl(var(--purple-ghost))] text-[hsl(var(--purple-main))]'}`}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => isComplete && setStep(step.id)}
                  >
                    {isComplete ? '✓' : index + 1}
                  </motion.button>
                  <span className="mt-2 text-sm font-medium">{step.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 