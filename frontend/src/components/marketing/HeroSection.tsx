'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { TRANSITIONS } from '@/lib/constants/animations'
import { useConversationAnimation } from '@/hooks/useConversationAnimation'

export function HeroSection() {
  const { visibleMessages, isTransitioning } = useConversationAnimation()

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 geometric-pattern opacity-[0.03]" />
      
      {/* Sharp Gradient Blocks */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                     transform -rotate-6" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                     transform rotate-6" />
      </div>

      {/* Sharp Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-600/20" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-purple-600/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Text Content */}
          <motion.div 
            className="relative z-10 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={TRANSITIONS}
          >
            {/* Beta Badge */}
            <motion.div
              className="boxy-gradient inline-block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.2 }}
            >
              <div className="bg-white px-4 py-2 flex items-center gap-2 transform translate-x-[2px] translate-y-[2px]">
                <div className="w-2 h-2 bg-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Now in Public Beta
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <motion.h1 
                className="text-6xl sm:text-7xl lg:text-8xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITIONS, delay: 0.3 }}
              >
                <span className="block font-light text-gray-900">Meet</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  KOKO NEXUS
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-4 text-gray-600 font-normal">
                  Multilingual Voice AI Platform
                </span>
              </motion.h1>
            </div>

            {/* Features */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.4 }}
            >
              {[
                { icon: 'fa-language', text: 'Instant Language Switching' },
                { icon: 'fa-bolt', text: '2.5s Response Time' },
                { icon: 'fa-globe', text: '100+ Languages' }
              ].map((feature) => (
                <div key={feature.text} className="boxy-badge">
                  <i className={`fas ${feature.icon} mr-2`} />
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-600 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.5 }}
            >
              The world's first AI receptionist that switches languages instantly during live calls. 
              Perfect for global businesses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.6 }}
            >
              <button 
                onClick={() => window.location.href='tel:+17755713834'}
                className="boxy-button-filled"
              >
                <i className="fas fa-phone-volume mr-2" />
                <span>Try Live Demo</span>
                <span className="ml-2 text-sm opacity-75">(+1 (775) 571-3834)</span>
              </button>
              
              <Link href="/deploy" className="boxy-button">
                <i className="fas fa-play mr-2" />
                Deploy Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Live Demo Card */}
          <motion.div
            className="relative z-10 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...TRANSITIONS, delay: 0.4 }}
          >
            <div className="boxy-card">
              {/* Live Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500" />
                  <span className="text-sm font-medium text-green-500">Live Demo</span>
                </div>
                <div className="text-sm text-gray-500">
                  <i className="fas fa-clock mr-2" />
                  <span>Real-time Translation</span>
                </div>
              </div>

              {/* Conversation Feed */}
              <motion.div 
                className="space-y-4 min-h-[400px]"
                layout
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }}
              >
                <AnimatePresence mode="wait">
                  {!isTransitioning && visibleMessages.map((message, index) => (
                    <motion.div
                      key={message.key}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      layout
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        height: {
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6
                        }
                      }}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                                        backdrop-blur-md flex items-center justify-center">
                            <i className={`fas ${message.speaker === 'user' ? 'fa-user' : 'fa-robot'} 
                                        text-purple-600`} />
                          </div>
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full 
                                           ${message.speaker === 'user' ? 'bg-purple-400' : 'bg-green-400'} 
                                           opacity-75`} />
                            <span className={`relative inline-flex rounded-full h-3 w-3 
                                           ${message.speaker === 'user' ? 'bg-purple-500' : 'bg-green-500'}`} />
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <i className={`fas ${message.speaker === 'user' ? 'fa-microphone' : 'fa-volume-up'} 
                                     ${message.speaker === 'user' ? 'animate-pulse' : ''}`} />
                          <span>
                            {message.speaker === 'user' ? 'Voice Input' : `Speaking in ${message.lang}`}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 
                                      backdrop-blur-sm border border-purple-500/10">
                          <p className="text-gray-700">{message.text}</p>
                        </div>
                        {message.speaker === 'user' && (
                          <div className="text-sm text-purple-600 font-medium">
                            {message.lang} detected
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 