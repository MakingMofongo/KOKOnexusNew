import { motion } from 'framer-motion'
import { Building2, MessageSquare, Clock, Globe, Phone } from 'lucide-react'

interface CustomTemplateFormProps {
  config: {
    industry: string
    businessType: string
    tone: string
    specificDetails: string
    businessHours?: {
      timezone: string
      schedule: Array<{ days: string[]; hours: string }>
    }
    languages?: string[]
    specialServices?: string[]
    complianceRequirements?: string[]
    productCategories?: string[]
    educationLevel?: string
    specializations?: string[]
  }
  setConfig: (config: any) => void
  onSubmit: (e: React.FormEvent) => void
  selectedTemplate: string | null
  selectedSubtype: string | null
}

const industrySpecificFields: Record<string, (config: any, setConfig: any) => React.ReactNode> = {
  'hotel-boutique': (config: any, setConfig: any) => (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Luxury Amenities</label>
        <textarea
          placeholder="List your premium amenities and services..."
          className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Concierge Services</label>
        <textarea
          placeholder="Describe your concierge services..."
          className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
          value={config.specificDetails}
          onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
          rows={3}
        />
      </div>
    </>
  ),

  'healthcare-clinic': (config: any, setConfig: any) => (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Medical Specialties</label>
        <textarea
          placeholder="List your medical specialties..."
          className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Compliance Requirements</label>
        <div className="space-y-2">
          {['HIPAA', 'HITECH', 'State-specific'].map(requirement => (
            <label key={requirement} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={config.complianceRequirements?.includes(requirement)}
                onChange={e => {
                  const requirements = config.complianceRequirements || []
                  setConfig({
                    ...config,
                    complianceRequirements: e.target.checked
                      ? [...requirements, requirement]
                      : requirements.filter((r: string) => r !== requirement)
                  })
                }}
              />
              <span className="ml-2">{requirement}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  ),

  'retail-boutique': (config: any, setConfig: any) => (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Product Categories</label>
        <textarea
          placeholder="List your main product categories..."
          className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
          value={config.productCategories?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            productCategories: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Return Policy</label>
        <textarea
          placeholder="Describe your return policy..."
          className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
          value={config.specificDetails}
          onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
          rows={3}
        />
      </div>
    </>
  ),
  
  // Add other template-specific fields...
}

export function CustomTemplateForm({ 
  config, 
  setConfig, 
  onSubmit, 
  selectedTemplate,
  selectedSubtype 
}: CustomTemplateFormProps) {
  const templateKey = selectedSubtype || selectedTemplate || ''
  const SpecificFields = industrySpecificFields[templateKey]

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit} 
      className="glass-panel p-8 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          {selectedSubtype ? `Configure ${selectedSubtype.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` : 'Custom Configuration'}
        </h3>
      </div>
      
      <div className="grid gap-6">
        {/* Common fields */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Business Hours</label>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 9:00-17:00"
                className="input-field flex-1"
                value={config.businessHours?.schedule[0]?.hours || ''}
                onChange={e => setConfig({
                  ...config,
                  businessHours: {
                    ...config.businessHours,
                    schedule: [{ days: ['MONDAY', 'FRIDAY'], hours: e.target.value }]
                  }
                })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Languages</label>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <select
                className="input-field flex-1"
                value={config.languages?.[0] || 'en'}
                onChange={e => setConfig({
                  ...config,
                  languages: [e.target.value]
                })}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Template-specific fields */}
        {SpecificFields && SpecificFields(config, setConfig)}

        {/* Communication tone - common for all */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Communication Tone</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="input-field w-full pl-10 pr-4 py-3"
              value={config.tone}
              onChange={e => setConfig({ ...config, tone: e.target.value })}
              required
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="enthusiastic">Enthusiastic</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          type="submit" 
          className="button-primary px-6 py-3"
        >
          Continue to Voice Selection
        </button>
      </div>
    </motion.form>
  )
} 