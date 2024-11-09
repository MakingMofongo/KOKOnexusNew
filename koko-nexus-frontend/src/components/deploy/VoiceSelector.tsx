'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { SPRING } from '@/lib/constants/animations'

const voices = [
  {
    id: 'marsh',
    name: 'Marsh',
    description: 'Professional and friendly male voice',
    preview: '/voices/marsh-preview.mp3',
    personality: 'Professional',
    accent: 'American',
    gender: 'Male',
    popular: true,
  },
  {
    id: 'sarah',
    name: 'Sarah',
    description: 'Warm and empathetic female voice',
    preview: '/voices/sarah-preview.mp3',
    personality: 'Friendly',
    accent: 'American',
    gender: 'Female',
  },
  {
    id: 'james',
    name: 'James',
    description: 'Authoritative and trustworthy male voice',
    preview: '/voices/james-preview.mp3',
    personality: 'Authoritative',
    accent: 'British',
    gender: 'Male',
  },
]

export function VoiceSelector() {
  const setVoice = useDeploymentStore(state => state.setVoice)
  const setStep = useDeploymentStore(state => state.setStep)
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null)
  const [playingPreview, setPlayingPreview] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const handleVoiceSelect = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId)
    if (!voice) return

    setSelectedVoice(voiceId)
    // Play preview
    if (audioRef.current) {
      audioRef.current.src = voice.preview
      audioRef.current.play()
      setPlayingPreview(voiceId)
    }

    // Update store and advance to next step
    setVoice({
      id: voice.id,
      name: voice.name,
      preview: voice.preview
    })
    
    // Add a small delay before transitioning to next step
    setTimeout(() => {
      setStep('number')
    }, 500)
  }

  const handlePreview = (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation()
    const voice = voices.find(v => v.id === voiceId)
    if (!voice || !audioRef.current) return

    audioRef.current.src = voice.preview
    audioRef.current.play()
    setPlayingPreview(voiceId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6">
        {voices.map((voice) => (
          <motion.div
            key={voice.id}
            className={`glass-panel p-6 relative overflow-hidden cursor-pointer
                       ${selectedVoice === voice.id ? 'ring-2 ring-[hsl(var(--purple-main))]' : ''}`}
            onClick={() => handleVoiceSelect(voice.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
          >
            {voice.popular && (
              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full 
                             bg-[hsl(var(--purple-main))] text-white">
                Popular
              </span>
            )}

            <div className="flex items-center gap-6">
              {/* Voice Waveform Visualization */}
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--purple-ghost))] 
                            flex items-center justify-center relative">
                {playingPreview === voice.id ? (
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[hsl(var(--purple-main))]"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ) : (
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[hsl(var(--purple-main)/0.5)]"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                  {voice.name}
                  <span className="text-sm font-normal text-[hsl(var(--purple-main)/0.7)]">
                    {voice.accent} • {voice.gender}
                  </span>
                </h3>
                <p className="text-[hsl(var(--purple-main)/0.8)]">{voice.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  className="button-secondary py-2"
                  onClick={(e) => handlePreview(e, voice.id)}
                >
                  Preview
                </button>
                {selectedVoice === voice.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING}
                    className="w-8 h-8 rounded-full bg-[hsl(var(--purple-main))] 
                              flex items-center justify-center text-white"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <audio 
        ref={audioRef} 
        className="hidden"
        onEnded={() => setPlayingPreview(null)}
      />

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button 
          className="button-primary"
          onClick={() => selectedVoice && handleVoiceSelect(selectedVoice)}
        >
          Continue
        </button>
      </div>
    </div>
  )
} 