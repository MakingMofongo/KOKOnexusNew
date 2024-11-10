import { motion } from 'framer-motion'
import { Globe2, Plus, X, ArrowLeft } from 'lucide-react'
import React from 'react'

interface LanguageSelectorProps {
  onSubmit: (languages: { primary: string, additional: string[] }) => void
  onBack: () => void
}

export function LanguageSelector({ onSubmit, onBack }: LanguageSelectorProps) {
  const [primaryLanguage, setPrimaryLanguage] = React.useState('')
  const [additionalLanguages, setAdditionalLanguages] = React.useState<string[]>([])

  const handleAddLanguage = () => {
    setAdditionalLanguages([...additionalLanguages, ''])
  }

  const handleRemoveLanguage = (index: number) => {
    setAdditionalLanguages(additionalLanguages.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      primary: primaryLanguage,
      additional: additionalLanguages.filter(lang => lang !== '')
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Templates
      </button>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Language Configuration</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Primary Language</label>
            <div className="relative">
              <Globe2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="input-field w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 appearance-none"
                value={primaryLanguage}
                onChange={e => setPrimaryLanguage(e.target.value)}
                required
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="nl">Dutch</option>
                <option value="ru">Russian</option>
                <option value="ar">Arabic</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Additional Languages</label>
              <button
                type="button"
                onClick={handleAddLanguage}
                className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 
                         hover:bg-purple-50 rounded-md transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Language
              </button>
            </div>

            <div className="space-y-3">
              {additionalLanguages.map((lang, index) => (
                <div key={index} className="flex gap-3">
                  <select
                    className="input-field flex-1 px-4 py-2 rounded-lg border border-gray-200 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             transition-all duration-200"
                    value={lang}
                    onChange={e => {
                      const newLanguages = [...additionalLanguages]
                      newLanguages[index] = e.target.value
                      setAdditionalLanguages(newLanguages)
                    }}
                  >
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                             rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
            Continue to Voice Selection
          </button>
        </div>
      </form>
    </motion.div>
  )
} 