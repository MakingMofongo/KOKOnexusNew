import { motion } from 'framer-motion'
import { Building2, MessageSquare, Clock, Globe, Phone } from 'lucide-react'

interface CustomTemplateFormProps {
  config: {
    businessName: string
    businessEmail: string
    businessPhone: string
    industry: string
    businessType: string
    tone: string
    specificDetails: string
    businessHours?: {
      timezone: string
      schedule: Array<{ days: string[]; hours: string }>
    }
    specialServices?: string[]
    complianceRequirements?: string[]
    productCategories?: string[]
    educationLevel?: string
    specializations?: string[]
    customerTypes?: string[]
    commonScenarios?: string[]
    keyPolicies?: string[]
    industryTerminology?: string[]
    competitorInfo?: string[]
    locationDetails?: {
      address: string
      facilities: string[]
      accessibility: string[]
    }
    staffInfo?: {
      roles: string[]
      expertise: string[]
      availability: string
    }
  }
  setConfig: (config: any) => void
  onSubmit: (e: React.FormEvent) => void
  selectedTemplate: string | null
  selectedSubtype: string | null
}

const industrySpecificFields: Record<string, (config: any, setConfig: any) => React.ReactNode> = {
  'hotel-boutique': (config, setConfig) => (
    <>
      <div className="space-y-6">
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
          <label className="block text-sm font-medium mb-2 text-gray-700">Guest Experience Details</label>
          <textarea
            placeholder="Describe your unique guest experience, check-in/out policies..."
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
            value={config.specificDetails}
            onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Common Guest Scenarios</label>
          <textarea
            placeholder="List common guest requests and how to handle them..."
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
            value={config.commonScenarios?.join('\n')}
            onChange={e => setConfig({ 
              ...config, 
              commonScenarios: e.target.value.split('\n').filter(Boolean)
            })}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Location & Facilities</label>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Hotel address"
              className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
              value={config.locationDetails?.address || ''}
              onChange={e => setConfig({
                ...config,
                locationDetails: {
                  ...config.locationDetails,
                  address: e.target.value
                }
              })}
            />
            <textarea
              placeholder="List nearby attractions, restaurants, transportation..."
              className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
              value={config.locationDetails?.facilities?.join('\n')}
              onChange={e => setConfig({
                ...config,
                locationDetails: {
                  ...config.locationDetails,
                  facilities: e.target.value.split('\n').filter(Boolean)
                }
              })}
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  ),

  'healthcare-clinic': (config, setConfig) => (
    <>
      <div className="space-y-6">
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
          <label className="block text-sm font-medium mb-2 text-gray-700">Common Medical Terms</label>
          <textarea
            placeholder="List common medical terms and their simple explanations..."
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
            value={config.industryTerminology?.join('\n')}
            onChange={e => setConfig({ 
              ...config, 
              industryTerminology: e.target.value.split('\n').filter(Boolean)
            })}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Staff Information</label>
          <textarea
            placeholder="List key medical staff, their roles and specialties..."
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
            value={config.staffInfo?.roles?.join('\n')}
            onChange={e => setConfig({
              ...config,
              staffInfo: {
                ...config.staffInfo,
                roles: e.target.value.split('\n').filter(Boolean)
              }
            })}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Compliance Requirements</label>
          <div className="space-y-2">
            {['HIPAA', 'HITECH', 'State-specific', 'Joint Commission', 'OSHA'].map(requirement => (
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

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Emergency Protocols</label>
          <textarea
            placeholder="Describe emergency handling procedures..."
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200"
            value={config.keyPolicies?.join('\n')}
            onChange={e => setConfig({ 
              ...config, 
              keyPolicies: e.target.value.split('\n').filter(Boolean)
            })}
            rows={4}
          />
        </div>
      </div>
    </>
  ),
  // Add other industry templates...
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
        {/* Basic Business Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Business Name</label>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter business name"
                className="input-field flex-1"
                value={config.businessName || ''}
                onChange={e => setConfig({
                  ...config,
                  businessName: e.target.value
                })}
                required
              />
            </div>
          </div>

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
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Business Email</label>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="contact@yourbusiness.com"
                className="input-field flex-1"
                value={config.businessEmail || ''}
                onChange={e => setConfig({
                  ...config,
                  businessEmail: e.target.value
                })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Business Phone</label>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="input-field flex-1"
                value={config.businessPhone || ''}
                onChange={e => setConfig({
                  ...config,
                  businessPhone: e.target.value
                })}
                required
              />
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