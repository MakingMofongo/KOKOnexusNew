'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useDeploymentStore } from '@/lib/store/deploymentStore'

const templates = [
  {
    id: 'retail',
    name: 'Retail Assistant',
    description: 'Perfect for stores and customer service',
    icon: '/icons/retail.svg',
    popular: true,
    templates: [
      { id: 'sales', name: 'Sales Assistant', icon: '💰' },
      { id: 'support', name: 'Support Agent', icon: '🎯' },
      { id: 'booking', name: 'Booking Agent', icon: '📅' },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare Assistant',
    description: 'HIPAA-compliant medical office assistant',
    icon: '/icons/healthcare.svg',
    templates: [
      { id: 'scheduling', name: 'Appointment Scheduler', icon: '📅' },
      { id: 'triage', name: 'Triage Assistant', icon: '🏥' },
      { id: 'followup', name: 'Follow-up Coordinator', icon: '📞' },
    ]
  },
  // Add more industry templates...
]

export function TemplateSelector() {
  const setIndustry = useDeploymentStore(state => state.setIndustry)
  const setTemplate = useDeploymentStore(state => state.setTemplate)
  const setStep = useDeploymentStore(state => state.setStep)
  const [selectedIndustry, setSelectedIndustryState] = React.useState<string | null>(null)

  const handleTemplateSelect = (templateId: string) => {
    setTemplate(templateId)
    setStep('voice')
  }

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustryState(industryId)
    setIndustry(industryId)
  }

  return (
    <div className="grid gap-8">
      {/* Industry Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((industry) => (
          <motion.button
            key={industry.id}
            className={`glass-panel p-6 text-left relative overflow-hidden group
                       ${selectedIndustry === industry.id ? 'ring-2 ring-[hsl(var(--purple-main))]' : ''}`}
            onClick={() => handleIndustrySelect(industry.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {industry.popular && (
              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full 
                             bg-[hsl(var(--purple-main))] text-white">
                Popular
              </span>
            )}
            
            <div className="mb-4 h-12 w-12 rounded-xl bg-[hsl(var(--purple-ghost))] 
                          flex items-center justify-center">
              <Image src={industry.icon} alt={industry.name} width={24} height={24} />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{industry.name}</h3>
            <p className="text-sm text-[hsl(var(--purple-main))]">
              {industry.description}
            </p>

            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-main)/0.1)] 
                          to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      {/* Template Selection */}
      {selectedIndustry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h3 className="heading-3 mb-6">Select a Template</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {templates
              .find(i => i.id === selectedIndustry)
              ?.templates.map((template) => (
                <motion.button
                  key={template.id}
                  className="glass-panel p-6 text-left hover:ring-2 hover:ring-[hsl(var(--purple-main))]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <span className="text-3xl mb-4 block">{template.icon}</span>
                  <h4 className="text-lg font-bold">{template.name}</h4>
                </motion.button>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  )
} 