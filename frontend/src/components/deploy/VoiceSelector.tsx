'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { SPRING } from '@/lib/constants/animations'
import { Mic, Volume2, VolumeX } from 'lucide-react'

// Sample text for voice preview
const PREVIEW_TEXT = "Hello! I'm your AI assistant. How can I help you today?"

const voices = [
  {
    id: 'D7dkYvH17OKLgp4SLulf',
    name: 'Rachel',
    description: 'Professional and friendly female voice',
    personality: 'Professional',
    accent: 'American',
    gender: 'Female',
    popular: true,
  },
  {
    id: 'lxYfHSkYm1EzQzGhdbfc',
    name: 'Emma',
    description: 'Clear and authoritative female voice',
    personality: 'Authoritative',
    accent: 'American',
    gender: 'Female',
  },
  {
    id: 'LruHrtVF6PSyGItzMNHS',
    name: 'Michael',
    description: 'Warm and empathetic male voice',
    personality: 'Friendly',
    accent: 'British',
    gender: 'Male',
  },
]

async function getVoicePreview(voiceId: string, text: string = PREVIEW_TEXT): Promise<Blob> {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': 'sk_7bbeb9177bb211854272694243bfc4da19cdd4123a544bfe'  || '',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get voice preview');
  }

  return await response.blob();
}

export function VoiceSelector() {
  const setVoice = useDeploymentStore(state => state.setVoice)
  const setStep = useDeploymentStore(state => state.setStep)
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null)
  const [playingPreview, setPlayingPreview] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const handleVoiceSelect = async (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId)
    if (!voice) return

    setSelectedVoice(voiceId)
    setIsLoading(true)
    setError(null)

    try {
      const audioBlob = await getVoicePreview(voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        await audioRef.current.play()
        setPlayingPreview(voiceId)
      }

      // Update store with the voice details
      setVoice({
        id: voice.id,
        name: voice.name,
        preview: audioUrl
      })
      
      // Add a small delay before transitioning to next step
      setTimeout(() => {
        setStep('number')
      }, 500)
    } catch (error) {
      console.error('Error playing voice preview:', error)
      setError('Failed to play voice preview. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = async (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation()
    const voice = voices.find(v => v.id === voiceId)
    if (!voice || !audioRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const audioBlob = await getVoicePreview(voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)
      
      audioRef.current.src = audioUrl
      await audioRef.current.play()
      setPlayingPreview(voiceId)
    } catch (error) {
      console.error('Error playing voice preview:', error)
      setError('Failed to play voice preview. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src)
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Voice</h2>
        <p className="text-gray-600">Choose the voice that best represents your business</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {voices.map((voice) => (
          <motion.div
            key={voice.id}
            className={`glass-panel p-6 relative overflow-hidden cursor-pointer
                       hover:shadow-lg transition-all duration-300
                       ${selectedVoice === voice.id ? 'ring-2 ring-purple-600 shadow-purple-100' : ''}`}
            onClick={() => handleVoiceSelect(voice.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
          >
            {voice.popular && (
              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full 
                             bg-purple-600 text-white font-medium">
                Popular
              </span>
            )}

            <div className="flex items-center gap-6">
              {/* Voice Icon/Visualization */}
              <div className="w-16 h-16 rounded-full bg-purple-50 
                            flex items-center justify-center relative">
                {isLoading && playingPreview === voice.id ? (
                  <motion.div
                    className="w-8 h-8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Mic className="w-8 h-8 text-purple-600" />
                  </motion.div>
                ) : playingPreview === voice.id ? (
                  <Volume2 className="w-8 h-8 text-purple-600" />
                ) : (
                  <VolumeX className="w-8 h-8 text-purple-400" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                  {voice.name}
                  <span className="text-sm font-normal text-gray-500">
                    {voice.accent} • {voice.gender}
                  </span>
                </h3>
                <p className="text-gray-600">{voice.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 
                           rounded-lg transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => handlePreview(e, voice.id)}
                  disabled={isLoading && playingPreview === voice.id}
                >
                  {playingPreview === voice.id ? 'Playing...' : 'Preview'}
                </button>
                {selectedVoice === voice.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING}
                    className="w-8 h-8 rounded-full bg-purple-600 
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
        onEnded={() => {
          setPlayingPreview(null)
          if (audioRef.current?.src) {
            URL.revokeObjectURL(audioRef.current.src)
          }
        }}
      />

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button 
          className="px-6 py-3 text-gray-600 hover:text-gray-900 
                   flex items-center gap-2"
          onClick={() => setStep('template')}
        >
          ← Back
        </button>
        <button 
          className="button-primary px-6 py-3 bg-purple-600 text-white 
                   rounded-lg hover:bg-purple-700 focus:ring-4 
                   focus:ring-purple-200 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => selectedVoice && handleVoiceSelect(selectedVoice)}
          disabled={!selectedVoice || isLoading}
        >
          Continue to Phone Number
        </button>
      </div>
    </div>
  )
} 