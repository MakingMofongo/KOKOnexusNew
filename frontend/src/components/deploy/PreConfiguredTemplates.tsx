import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Template {
  id: string
  name: string
  icon: ReactNode
  description: string
  subtypes?: Array<{
    id: string
    name: string
    description: string
    recommended?: boolean
    beta?: boolean
    recommendationReason?: string
    betaMessage?: string
  }>
}

interface PreConfiguredTemplatesProps {
  templates: Template[]
  onSelect: (id: string) => void
}

export function PreConfiguredTemplates({ templates, onSelect }: PreConfiguredTemplatesProps) {
  return (
    <div>
      <h3 className="heading-3 mb-6">Select a Template</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            className="glass-panel p-6 text-left hover:ring-2 hover:ring-purple-600
                     hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
          >
            <div className="mb-4 h-16 w-16 rounded-xl bg-purple-50 
                          flex items-center justify-center">
              {template.icon}
            </div>
            <h4 className="text-lg font-bold mb-2 text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-4">
              {template.description}
            </p>
            {template.subtypes?.map((subtype) => (
              <div key={subtype.id} className="mt-3 p-3 border rounded-lg bg-white">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{subtype.name}</span>
                  <div className="flex gap-2">
                    {subtype.recommended && (
                      <span className="recommended-badge">
                        Recommended
                      </span>
                    )}
                    {subtype.beta && (
                      <span className="beta-badge">
                        Beta
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{subtype.description}</p>
                {subtype.recommendationReason && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {subtype.recommendationReason}
                  </p>
                )}
                {subtype.beta && (
                  <p className="mt-2 text-sm text-yellow-600">
                    ⓘ {subtype.betaMessage}
                  </p>
                )}
              </div>
            ))}
          </motion.button>
        ))}
      </div>
    </div>
  )
} 