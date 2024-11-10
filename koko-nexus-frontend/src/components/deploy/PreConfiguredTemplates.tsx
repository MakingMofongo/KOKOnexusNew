import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Template {
  id: string
  name: string
  icon: ReactNode
  description: string
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
            <p className="text-sm text-gray-600">
              {template.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  )
} 