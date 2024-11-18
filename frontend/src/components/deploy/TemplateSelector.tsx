'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { CustomTemplateForm } from './CustomTemplateForm'
import { PreConfiguredTemplates } from './PreConfiguredTemplates'
import { LanguageSelector } from './LanguageSelector'
import { 
  Building2, 
  HeartPulse, 
  Settings2, 
  ShoppingBag, 
  Stethoscope, 
  Calendar,
  HeadsetIcon,
  ClipboardCheck,
  Users,
  MessageCircle,
  PhoneCall,
  Wrench
} from 'lucide-react'

const templates = [
  {
    id: 'hotel',
    name: 'Hotel Assistant',
    description: 'Perfect for hotels and hospitality services',
    icon: <Building2 className="w-6 h-6 text-purple-600" />,
    popular: true,
    preConfigured: true,
    templates: [
      { 
        id: 'frontdesk', 
        name: 'Front Desk Assistant', 
        icon: <Users className="w-8 h-8 text-purple-600" />, 
        description: 'Handles check-ins, reservations and guest services' 
      },
      { 
        id: 'concierge', 
        name: 'Concierge Service', 
        icon: <HeadsetIcon className="w-8 h-8 text-purple-600" />, 
        description: 'Manages guest requests and local recommendations' 
      },
      { 
        id: 'roomservice', 
        name: 'Room Service Agent', 
        icon: <Calendar className="w-8 h-8 text-purple-600" />, 
        description: 'Handles room service orders and special requests' 
      },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare Assistant',
    description: 'HIPAA-compliant medical office assistant',
    icon: <HeartPulse className="w-6 h-6 text-purple-600" />,
    preConfigured: true,
    templates: [
      { 
        id: 'scheduling', 
        name: 'Appointment Scheduler', 
        icon: <Calendar className="w-8 h-8 text-purple-600" />, 
        description: 'Medical appointment management' 
      },
      { 
        id: 'triage', 
        name: 'Triage Assistant', 
        icon: <Stethoscope className="w-8 h-8 text-purple-600" />, 
        description: 'Initial patient assessment' 
      },
      { 
        id: 'followup', 
        name: 'Follow-up Coordinator', 
        icon: <PhoneCall className="w-8 h-8 text-purple-600" />, 
        description: 'Patient follow-up management' 
      },
    ]
  },
  {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Build your own template from scratch',
    icon: <Settings2 className="w-6 h-6 text-purple-600" />,
    preConfigured: false,
    templates: []
  }
]

export function TemplateSelector() {
  const setIndustry = useDeploymentStore(state => state.setIndustry)
  const setSelectedTemplate = useDeploymentStore(state => state.setSelectedTemplate)
  const setStep = useDeploymentStore(state => state.setStep)

  const [selectedIndustry, setSelectedIndustryState] = React.useState<string | null>(null)
  const [customConfig, setCustomConfig] = React.useState({
    industry: '',
    businessType: '',
    tone: 'professional'
  })

  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false)
  const [selectedTemplate, setSelectedTemplateState] = React.useState<string | null>(null)

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustryState(industryId)
    setIndustry(industryId)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateState(templateId)
    setShowLanguageSelector(true)
  }

  const handleLanguageSubmit = (languages: { primary: string, additional: string[] }) => {
    if (selectedTemplate) {
      setSelectedTemplate(selectedTemplate)
      setStep('voice')
      useDeploymentStore.setState(state => ({
        ...state,
        languages: {
          primary: languages.primary,
          additional: languages.additional
        }
      }))
    }
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedTemplateState('custom')
    setShowLanguageSelector(true)
    setSelectedTemplate('custom')
    setIndustry(customConfig.industry)
  }

  if (showLanguageSelector && selectedTemplate) {
    return (
      <LanguageSelector 
        onSubmit={handleLanguageSubmit}
        onBack={() => setShowLanguageSelector(false)}
      />
    )
  }

  return (
    <div className="grid gap-8">
      {/* Industry Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((industry) => (
          <motion.button
            key={industry.id}
            className={`glass-panel p-6 text-left relative overflow-hidden group
                       hover:shadow-lg transition-all duration-300
                       ${selectedIndustry === industry.id ? 'ring-2 ring-purple-600 shadow-purple-100' : ''}`}
            onClick={() => handleIndustrySelect(industry.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {industry.popular && (
              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full 
                             bg-purple-600 text-white font-medium">
                Popular
              </span>
            )}
            
            <div className="mb-4 h-12 w-12 rounded-xl bg-purple-50 
                          flex items-center justify-center">
              {industry.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-900">{industry.name}</h3>
            <p className="text-sm text-gray-600">
              {industry.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Template Selection or Custom Configuration */}
      {selectedIndustry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {selectedIndustry === 'custom' ? (
            <CustomTemplateForm
              config={customConfig}
              setConfig={setCustomConfig}
              onSubmit={handleCustomSubmit}
            />
          ) : (
            <PreConfiguredTemplates
              templates={templates.find(i => i.id === selectedIndustry)?.templates || []}
              onSelect={handleTemplateSelect}
            />
          )}
        </motion.div>
      )}
    </div>
  )
} 