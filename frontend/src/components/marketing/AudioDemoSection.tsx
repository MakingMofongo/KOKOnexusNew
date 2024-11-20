'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TRANSITIONS } from '@/lib/constants/animations'
import Image from 'next/image'

const demoCards = [
  {
    language: 'English',
    title: 'Hilton Edinburgh Carlton',
    description: 'Luxury suite booking with special requests',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    audioId: 'english-demo',
    location: 'Edinburgh, UK',
    duration: '1:24'
  },
  {
    language: 'Finnish',
    title: 'Hotel Kämp Helsinki',
    description: 'Executive room reservation with spa package',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    audioId: 'finnish-demo',
    location: 'Helsinki, Finland',
    duration: '1:45'
  },
  {
    language: 'Arabic',
    title: 'Burj Al Arab Dubai',
    description: 'Royal suite booking with airport transfer',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    audioId: 'arabic-demo',
    location: 'Dubai, UAE',
    duration: '2:01'
  }
]

export function AudioDemoSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Audio Visualization Background */}
        {isClient && (
          <div className="absolute inset-0 opacity-20">
            <div className="audio-bars flex justify-center items-end h-full">
              {Array.from({ length: 128 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 mx-[1px] bg-gradient-to-t from-purple-500 to-blue-500 audio-bar"
                  style={{
                    animationDelay: `${i * 0.01}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-bg opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border-[3px] border-purple-600 mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...TRANSITIONS, delay: 0.1 }}
          >
            <i className="fas fa-headphones text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Live Demo Recordings
            </span>
          </motion.div>

          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={TRANSITIONS}
          >
            Experience Live Demos
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...TRANSITIONS, delay: 0.1 }}
          >
            Listen to real conversations with our AI receptionist
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoCards.map((demo, index) => (
            <motion.div
              key={demo.language}
              className="group relative bg-black/20 border-[3px] border-purple-600 
                       hover:border-purple-500 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...TRANSITIONS, delay: index * 0.1 }}
            >
              {/* Image Section */}
              <div className="relative aspect-video">
                <Image
                  src={demo.image}
                  alt={demo.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/30 border-[2px] border-white/20">
                  <span className="text-xs text-white/90">
                    <i className="fas fa-map-marker-alt mr-1" />
                    {demo.location}
                  </span>
                </div>

                {/* Play Button */}
                <button className="absolute inset-0 m-auto w-16 h-16 bg-purple-600 border-[3px] border-white 
                                flex items-center justify-center text-white transform group-hover:scale-110 
                                transition-transform duration-300 hover:bg-purple-700">
                  <i className="fas fa-play text-xl" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-400 border-[2px] border-purple-600 px-2 py-1">
                    {demo.language} Demo
                  </span>
                  <span className="text-sm text-gray-400">
                    <i className="fas fa-clock mr-2" />
                    {demo.duration}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {demo.title}
                </h3>
                
                <p className="text-gray-400">{demo.description}</p>

                {/* Audio Progress (Hidden initially) */}
                <div className="hidden audio-progress mt-4 space-y-2">
                  <div className="h-1 bg-gray-700">
                    <div className="progress-bar h-full w-0 bg-gradient-to-r from-purple-500 to-blue-500 
                                transition-all duration-300" />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="current-time">0:00</span>
                    <span className="total-time">{demo.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 