'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { SPRING } from '@/lib/constants/animations'

const steps = [
  { id: 'template', name: 'Select Template', icon: 'fa-list-check' },
  { id: 'voice', name: 'Choose Voice', icon: 'fa-microphone' },
  { id: 'number', name: 'Phone Number', icon: 'fa-phone' },
  { id: 'deploy', name: 'Deploy', icon: 'fa-rocket' },
] as const

export function DeploymentProgress() {
  const currentStep = useDeploymentStore(state => state.step)

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-[3px] bg-purple-100">
            <motion.div 
              className="h-full bg-purple-600"
              initial={{ width: '0%' }}
              animate={{ 
                width: currentStep === 'template' ? '0%' :
                       currentStep === 'voice' ? '33%' :
                       currentStep === 'number' ? '66%' :
                       '100%'
              }}
              transition={SPRING}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep
              const isPast = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center
                              ${isActive || isPast ? 'border-purple-600 bg-purple-50' : 'border-purple-200 bg-white'}`}
                    whileHover={{ scale: 1.1 }}
                    transition={SPRING}
                  >
                    <i className={`fas ${step.icon} ${isActive || isPast ? 'text-purple-600' : 'text-purple-200'}`} />
                  </motion.div>
                  <div className="mt-2 text-sm font-medium text-gray-600">
                    {step.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 