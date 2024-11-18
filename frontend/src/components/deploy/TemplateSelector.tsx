'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import { useDeploymentStore } from '@/lib/store/deploymentStore'

export function TemplateSelector() {
  const { setStep, setSelectedTemplate, setIndustry } = useDeploymentStore()

  const handleSelectTemplate = (template: string, industry: string) => {
    setSelectedTemplate(template)
    setIndustry(industry)
    setStep('voice')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
          onClick={() => handleSelectTemplate('hotel', 'hospitality')}
          className="group p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200"
        >
          {/* Rest of the template content */}
        </motion.button>
      </div>
    </div>
  )
} 