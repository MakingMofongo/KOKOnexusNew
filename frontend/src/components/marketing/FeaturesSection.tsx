'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import Image from 'next/image'

const features = [
  {
    title: 'Neural Voice Engine',
    category: 'Voice Technology',
    description: 'Ultra-realistic voice synthesis powered by Eleven Labs',
    icon: 'fa-waveform-lines',
    color: 'purple',
    demo: {
      image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3',
      title: 'Voice Synthesis',
      caption: 'Powered by Eleven Labs v2'
    },
    metrics: [
      { value: '99.8%', label: 'Natural Speech', icon: 'fa-wave-square' },
      { value: '<50ms', label: 'Latency', icon: 'fa-bolt' },
      { value: '95+', label: 'Voices', icon: 'fa-microphone' }
    ],
    techSpecs: [
      { title: 'Voice Model', value: 'Eleven Labs v2', icon: 'fa-wave-square' },
      { title: 'Voice Cloning', value: 'Supported', icon: 'fa-clone' },
      { title: 'Emotion Control', value: 'Advanced', icon: 'fa-face-smile' },
      { title: 'Streaming', value: 'Real-time', icon: 'fa-broadcast-tower' }
    ],
    capabilities: [
      'Instant Voice Cloning',
      'Emotional Intelligence',
      'Multi-speaker Synthesis',
      'Real-time Streaming',
      'Voice Design Studio',
      'Custom Voice Training'
    ]
  },
  {
    title: 'Language Processing',
    category: 'AI & ML',
    description: 'Custom language detection model with Deepgram transcription',
    icon: 'fa-language',
    color: 'blue',
    demo: {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3',
      title: 'Language Intelligence',
      caption: 'Neural language detection & transcription'
    },
    metrics: [
      { value: '95+', label: 'Languages', icon: 'fa-language' },
      { value: '0.2s', label: 'Detection', icon: 'fa-bolt' },
      { value: '99.2%', label: 'Accuracy', icon: 'fa-bullseye' }
    ],
    techSpecs: [
      { title: 'Speech-to-Text', value: 'Deepgram Nova', icon: 'fa-file-audio' },
      { title: 'Detection', value: 'Custom Model', icon: 'fa-brain' },
      { title: 'Transcription', value: 'Real-time', icon: 'fa-clock' },
      { title: 'Context', value: 'Preserved', icon: 'fa-link' }
    ],
    capabilities: [
      'Real-time Transcription',
      'Language Detection',
      'Accent Recognition',
      'Context Preservation',
      'Cultural Adaptation',
      'Semantic Analysis'
    ]
  },
  {
    title: 'Speech Recognition',
    category: 'Audio Processing',
    description: 'High-accuracy speech recognition with Gladia',
    icon: 'fa-ear-listen',
    color: 'green',
    demo: {
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3',
      title: 'Speech Recognition',
      caption: 'Powered by Gladia AI'
    },
    metrics: [
      { value: '99%', label: 'Accuracy', icon: 'fa-check-circle' },
      { value: '<1s', label: 'Processing', icon: 'fa-clock' },
      { value: '40+', label: 'Accents', icon: 'fa-globe' }
    ],
    techSpecs: [
      { title: 'Engine', value: 'Gladia AI', icon: 'fa-microphone' },
      { title: 'Processing', value: 'Streaming', icon: 'fa-stream' },
      { title: 'Noise Cancel', value: 'Advanced', icon: 'fa-volume-slash' },
      { title: 'Diarization', value: 'Real-time', icon: 'fa-users' }
    ],
    capabilities: [
      'Noise Cancellation',
      'Speaker Diarization',
      'Accent Detection',
      'Punctuation',
      'Word Timestamps',
      'Confidence Scores'
    ]
  }
]

const colorVariants = {
  purple: 'border-purple-500 text-purple-400 bg-purple-900/20',
  blue: 'border-blue-500 text-blue-400 bg-blue-900/20',
  green: 'border-green-500 text-green-400 bg-green-900/20'
}

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section className="py-32 relative overflow-hidden bg-gray-900" id="features">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border-[3px] border-purple-500 mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <i className="fas fa-microchip text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Technical Specifications
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            Enterprise-Grade Technology
          </motion.h2>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Feature Navigation */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`group relative p-6 cursor-pointer transition-all duration-300
                         border-[3px] ${activeFeature === index ? 'bg-white/10 border-purple-500' : 'border-white/10 hover:border-purple-500/50'}`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: index * 0.1 }}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-purple-500 flex items-center justify-center">
                    <i className={`fas ${feature.icon} text-2xl text-purple-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-purple-400 mb-1">{feature.category}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>

                {/* Technical Metrics */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                  {feature.metrics.map((metric) => (
                    <div key={metric.label} className="text-center group">
                      <div className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                        <i className={`fas ${metric.icon} text-purple-400 group-hover:scale-110 transition-transform`} />
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technical Details */}
          <div className="relative">
            <motion.div
              className="sticky top-8 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={SPRING}
            >
              {/* Technical Visualization */}
              <div className="relative aspect-video overflow-hidden border-[3px] border-purple-500">
                <Image
                  src={features[activeFeature].demo.image}
                  alt={features[activeFeature].demo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {features[activeFeature].demo.title}
                  </h4>
                  <p className="text-white/80">
                    {features[activeFeature].demo.caption}
                  </p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white/5 border-[3px] border-purple-500 p-6">
                <h4 className="text-lg font-bold text-white mb-6">Technical Specifications</h4>
                <div className="grid grid-cols-2 gap-6">
                  {features[activeFeature].techSpecs.map((spec) => (
                    <div key={spec.title} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 border-2 border-purple-500 flex items-center justify-center">
                        <i className={`fas ${spec.icon} text-purple-400 group-hover:scale-110 transition-transform`} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">{spec.title}</div>
                        <div className="text-white font-mono">{spec.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features[activeFeature].capabilities.map((capability) => (
                  <div key={capability} className="flex items-center gap-2 p-4 bg-white/5 border border-purple-500/20">
                    <div className="w-4 h-4 border-2 border-purple-500 flex items-center justify-center">
                      <i className="fas fa-check text-xs text-purple-400" />
                    </div>
                    <span className="text-gray-400 text-sm">{capability}</span>
                  </div>
                ))}
              </div>

              {/* Live Demo Button */}
              <motion.button
                className="w-full p-4 bg-purple-500/20 border-[3px] border-purple-500 
                         hover:bg-purple-500/30 transition-colors duration-300 group"
                whileHover={{ x: 4 }}
                onClick={() => window.location.href='tel:+17755713834'}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-phone-volume text-purple-400 group-hover:animate-pulse" />
                    <span className="text-white">Experience Live Demo</span>
                  </div>
                  <i className="fas fa-arrow-right text-purple-400" />
                </div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 