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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Luxury Amenities & Features</label>
        <textarea
          placeholder="List your unique amenities, VIP services, and exclusive partnerships..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Special Experiences</label>
        <textarea
          placeholder="Describe special experiences, concierge services, and fine dining options..."
          className="input-field w-full"
          value={config.specificDetails}
          onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  ),

  'hotel-business': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Business Facilities</label>
        <textarea
          placeholder="List business center capabilities, meeting spaces, corporate services..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Corporate Programs</label>
        <textarea
          placeholder="Describe corporate rates, group booking policies, airport services..."
          className="input-field w-full"
          value={config.specificDetails}
          onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  ),

  'hotel-resort': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Recreational Facilities</label>
        <textarea
          placeholder="List all recreational facilities, activities, and entertainment options..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Family & Entertainment Services</label>
        <textarea
          placeholder="Describe family packages, entertainment schedules, special events..."
          className="input-field w-full"
          value={config.specificDetails}
          onChange={e => setConfig({ ...config, specificDetails: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  ),

  'healthcare-clinic': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Medical Services</label>
        <textarea
          placeholder="List your medical services, specialties, and urgent care capabilities..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Insurance & Compliance</label>
        <textarea
          placeholder="List accepted insurance providers and compliance requirements..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Emergency Protocols</label>
        <textarea
          placeholder="Describe urgent care protocols and emergency procedures..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'healthcare-specialist': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Specialist Services</label>
        <textarea
          placeholder="List your specialized medical services and treatment areas..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Referral Requirements</label>
        <textarea
          placeholder="Describe referral processes and requirements..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Insurance & Authorization</label>
        <textarea
          placeholder="List insurance details and authorization requirements..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'healthcare-dental': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Dental Services</label>
        <textarea
          placeholder="List all dental services and procedures offered..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Emergency Procedures</label>
        <textarea
          placeholder="Describe dental emergency protocols and handling..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Insurance & Payment Plans</label>
        <textarea
          placeholder="List accepted insurance and available payment plans..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'education-elementary': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">School Programs</label>
        <textarea
          placeholder="List grade levels, special programs, and after-school activities..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Safety & Communication Protocols</label>
        <textarea
          placeholder="Describe attendance policies, safety procedures, parent communication..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">School Events & Activities</label>
        <textarea
          placeholder="List regular school events and activities..."
          className="input-field w-full"
          value={config.commonScenarios?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            commonScenarios: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'education-highschool': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Academic Programs</label>
        <textarea
          placeholder="List academic programs, extracurricular activities, and requirements..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Academic Policies</label>
        <textarea
          placeholder="Describe grading policies, attendance requirements, academic standards..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Student Activities</label>
        <textarea
          placeholder="List sports, clubs, and other student activities..."
          className="input-field w-full"
          value={config.commonScenarios?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            commonScenarios: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'education-university': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Academic Programs & Departments</label>
        <textarea
          placeholder="List academic programs, departments, and degree offerings..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Campus Services</label>
        <textarea
          placeholder="Describe available campus services and resources..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Enrollment Policies</label>
        <textarea
          placeholder="List enrollment requirements and procedures..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'corporate-executive': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Executive Services</label>
        <textarea
          placeholder="List executive-level services and facilities..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confidentiality Protocols</label>
        <textarea
          placeholder="Describe confidentiality requirements and handling procedures..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Priority Handling</label>
        <textarea
          placeholder="List priority handling procedures and VIP protocols..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'corporate-midlevel': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Department Operations</label>
        <textarea
          placeholder="List departmental services and operational procedures..."
          className="input-field w-full"
          value={config.specialServices?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specialServices: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Team Coordination</label>
        <textarea
          placeholder="Describe team coordination and project management procedures..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'corporate-entrylevel': (config, setConfig) => (
    <div className="space-y-6">
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
    </div>
  ),

  'professional-law': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Legal Practice Areas</label>
        <textarea
          placeholder="List your practice areas and specialized legal services..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Client Confidentiality</label>
        <textarea
          placeholder="Describe confidentiality policies and client handling procedures..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Legal Procedures</label>
        <textarea
          placeholder="List standard legal procedures and document handling..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'professional-consulting': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Consulting Services</label>
        <textarea
          placeholder="List your consulting services and expertise areas..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Project Management</label>
        <textarea
          placeholder="Describe project handling and consultation procedures..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  ),

  'professional-accounting': (config, setConfig) => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Accounting Services</label>
        <textarea
          placeholder="List your accounting services and specializations..."
          className="input-field w-full"
          value={config.specializations?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            specializations: e.target.value.split('\n').filter(Boolean)
          })}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tax & Compliance</label>
        <textarea
          placeholder="Describe tax services and compliance procedures..."
          className="input-field w-full"
          value={config.complianceRequirements?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            complianceRequirements: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Financial Procedures</label>
        <textarea
          placeholder="List standard financial procedures and document handling..."
          className="input-field w-full"
          value={config.keyPolicies?.join('\n')}
          onChange={e => setConfig({ 
            ...config, 
            keyPolicies: e.target.value.split('\n').filter(Boolean)
          })}
          rows={3}
        />
      </div>
    </div>
  )
};

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