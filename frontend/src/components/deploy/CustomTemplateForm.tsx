import { motion } from 'framer-motion'
import { 
  Building2, 
  MessageSquare,
} from 'lucide-react'

interface CustomTemplateFormProps {
  config: {
    industry: string
    businessType: string
    tone: string
  }
  setConfig: (config: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CustomTemplateForm({ config, setConfig, onSubmit }: CustomTemplateFormProps) {
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
        <h3 className="text-2xl font-bold text-gray-900">Custom Configuration</h3>
      </div>
      
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Industry Type</label>
          <input
            type="text"
            placeholder="e.g. Technology, Education, Finance"
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200 
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     transition-all duration-200"
            value={config.industry}
            onChange={e => setConfig({ ...config, industry: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Business Type</label>
          <input
            type="text"
            placeholder="e.g. SaaS, Consulting, E-commerce"
            className="input-field w-full px-4 py-3 rounded-lg border border-gray-200 
                     focus:ring-2 focus:ring-purple-500 focus:border-transparent
                     transition-all duration-200"
            value={config.businessType}
            onChange={e => setConfig({ ...config, businessType: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Communication Tone</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="input-field w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 appearance-none"
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
          className="button-primary px-6 py-3 bg-purple-600 text-white rounded-lg
                   hover:bg-purple-700 focus:ring-4 focus:ring-purple-200
                   transition-all duration-200 flex items-center gap-2"
        >
          Continue to Language Selection
        </button>
      </div>
    </motion.form>
  )
} 