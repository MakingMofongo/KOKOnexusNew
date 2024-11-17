'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import Image from 'next/image'

const steps = [
  {
    title: 'Choose Template',
    description: 'Select from our pre-built industry templates or customize your own.',
    icon: 'fa-list-check',
    color: 'from-purple-500 to-blue-500',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
    features: [
      'Hotel & Hospitality',
      'Medical & Healthcare',
      'Real Estate',
      'Custom Templates'
    ]
  },
  {
    title: 'Configure Voice',
    description: 'Pick a voice that matches your brand and customize the personality.',
    icon: 'fa-microphone',
    color: 'from-blue-500 to-cyan-500',
    preview: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3',
    features: [
      'Natural Voice Synthesis',
      'Emotion Control',
      'Accent Selection',
      'Custom Voice Training'
    ]
  },
  {
    title: 'Set Up Number',
    description: 'Get a new number or port your existing one in minutes.',
    icon: 'fa-phone',
    color: 'from-cyan-500 to-emerald-500',
    preview: 'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?ixlib=rb-4.0.3',
    features: [
      'Instant Number Assignment',
      'Number Porting',
      'Virtual Numbers',
      'Call Forwarding'
    ]
  },
  {
    title: 'Go Live',
    description: 'Deploy your AI assistant and start handling calls instantly.',
    icon: 'fa-rocket',
    color: 'from-emerald-500 to-purple-500',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
    features: [
      'One-Click Deploy',
      'Real-time Monitoring',
      'Instant Scaling',
      'Analytics Dashboard'
    ]
  }
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white" id="how-it-works">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r 
                     from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-full mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <i className="fas fa-magic text-purple-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Simple Setup Process
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 
                     bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            Up and Running in Minutes
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.3 }}
          >
            Our streamlined setup process gets you from zero to live calls in under 5 minutes
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                         ${activeStep === index ? 'bg-white shadow-lg scale-[1.02]' : 'hover:bg-white/50'}`}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: index * 0.1 }}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color}
                                flex items-center justify-center transform -rotate-6 
                                group-hover:rotate-0 transition-transform duration-300`}>
                    <i className={`fas ${step.icon} text-2xl text-white`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 
                                bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                               ${activeStep === index ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
                    {activeStep === index ? (
                      <i className="fas fa-check text-purple-600" />
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Feature List */}
                <motion.div
                  className="mt-4 grid grid-cols-2 gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: activeStep === index ? 1 : 0, height: activeStep === index ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-purple-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Preview Panel */}
          <motion.div
            className="relative aspect-square rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            {/* Background with Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 
                         backdrop-blur-xl border border-white/20 shadow-2xl" />

            {/* Preview Content */}
            <div className="relative p-8 h-full">
              <div className="h-full rounded-xl overflow-hidden">
                <Image
                  src={steps[activeStep].preview}
                  alt={steps[activeStep].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>

              {/* Interactive Elements */}
              <div className="absolute inset-x-8 bottom-8 p-6 backdrop-blur-md bg-white/10 
                           border border-white/20 rounded-xl">
                <h4 className="text-white font-semibold mb-2">{steps[activeStep].title}</h4>
                <p className="text-white/80 text-sm">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 