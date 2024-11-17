'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import { useDeploymentStore } from '@/lib/store/deploymentStore'

// From backend interface.ts
const elevenLabsVoices = {
  RACHEL: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Female, Conversational' },
  DOMI: { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Female, Strong' },
  BELLA: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Female, Soft' },
  ANTONI: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Male, Well-Rounded' },
  ELLI: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Female, Young' },
  JOSH: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Male, Young' },
  ARNOLD: { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Male, Strong' },
  ADAM: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Male, Deep' },
  SAM: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Male, Raspy' },
  NICOLE: { id: 'piTKgcLEGmPE4e6mEKli', name: 'Nicole', description: 'Female, Professional' },
  GLINDA: { id: 'z9fAnlkpzviPz146aGWa', name: 'Glinda', description: 'Female, Warm' }
} as const

export function VoiceSelector() {
  const { setVoice, setStep } = useDeploymentStore()
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [voiceSettings, setVoiceSettings] = useState({
    model: 'eleven_turbo_v2_5',
    stability: 0.5,
    similarityBoost: 0.75
  })

  const handleContinue = () => {
    if (!selectedVoice) return

    const voice = Object.values(elevenLabsVoices).find(v => v.id === selectedVoice)
    if (!voice) return

    setVoice({
      provider: '11labs',
      voiceId: voice.id,
      name: voice.name,
      ...voiceSettings
    })
    setStep('number')
  }

  return (
    <div className="space-y-8">
      {/* Voice Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(elevenLabsVoices).map((voice) => (
          <motion.button
            key={voice.id}
            className={`p-6 border-[3px] text-left transition-all duration-200
                     ${selectedVoice === voice.id 
                       ? 'border-purple-600 bg-purple-50' 
                       : 'border-gray-200 hover:border-purple-300'}`}
            onClick={() => setSelectedVoice(voice.id)}
            whileHover={{ scale: 1.02 }}
            transition={SPRING}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border-2 border-purple-600 flex items-center justify-center">
                <i className="fas fa-microphone text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{voice.name}</h3>
                <p className="text-sm text-gray-600">{voice.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Voice Settings */}
      {selectedVoice && (
        <motion.div
          className="space-y-6 p-6 border-[3px] border-purple-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <h3 className="font-bold text-lg">Voice Settings</h3>
          
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <select
              className="w-full boxy-input"
              value={voiceSettings.model}
              onChange={(e) => setVoiceSettings(prev => ({ ...prev, model: e.target.value }))}
            >
              <option value="eleven_turbo_v2_5">Turbo V2.5 (Recommended)</option>
              <option value="eleven_multilingual_v2">Multilingual V2</option>
              <option value="eleven_turbo_v2">Turbo V2</option>
              <option value="eleven_monolingual_v1">Monolingual V1</option>
            </select>
          </div>

          {/* Stability Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Stability: {voiceSettings.stability}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.stability}
              onChange={(e) => setVoiceSettings(prev => ({ 
                ...prev, 
                stability: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>

          {/* Similarity Boost Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Similarity Boost: {voiceSettings.similarityBoost}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.similarityBoost}
              onChange={(e) => setVoiceSettings(prev => ({ 
                ...prev, 
                similarityBoost: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button 
          onClick={() => setStep('template')}
          className="boxy-button"
        >
          <i className="fas fa-arrow-left mr-2" />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedVoice}
          className={`boxy-button-filled ${!selectedVoice && 'opacity-50 cursor-not-allowed'}`}
        >
          Continue
          <i className="fas fa-arrow-right ml-2" />
        </button>
      </div>
    </div>
  )
} 