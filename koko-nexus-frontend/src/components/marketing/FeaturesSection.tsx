'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TRANSITIONS, SPRING, HOVER_SPRING } from '@/lib/constants/animations'

const features = [
  {
    title: 'Multilingual Support',
    description: 'Support customers in multiple languages with natural voice interactions',
    icon: '🌍',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Industry Templates',
    description: 'Pre-built templates optimized for your specific industry needs',
    icon: '📋',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Real-time Analytics',
    description: 'Monitor and optimize performance with detailed analytics',
    icon: '📊',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    title: 'Custom Voice & Personality',
    description: 'Customize voice and personality to match your brand',
    icon: '🎭',
    gradient: 'from-orange-500 to-red-500',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements with reactive gradients */}
      <motion.div 
        className="absolute inset-0"
        initial={false}
        animate={{ 
          background: [
            "radial-gradient(circle at 0% 0%, hsl(var(--purple-ghost)) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, hsl(var(--purple-ghost)) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      <div className="container mx-auto relative">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
        >
          <motion.div
            className="inline-block px-4 py-2 rounded-full glass-panel mb-6
                       border border-[hsl(var(--purple-main)/0.2)]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={SPRING}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--purple-main))] to-[hsl(var(--purple-light))] 
                           bg-clip-text text-transparent">
              Powerful Features ✨
            </span>
          </motion.div>

          <motion.h2 
            className="heading-2 mb-6 bg-gradient-to-r from-[hsl(var(--purple-main))] to-[hsl(var(--purple-light))] 
                       bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            Everything You Need
          </motion.h2>
          <motion.p 
            className="body-large max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            Deploy and manage AI call assistants with enterprise-grade features
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-panel p-8 relative group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: HOVER_SPRING
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 } 
              }}
            >
              {/* Feature Icon with reactive animation */}
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                           flex items-center justify-center mb-6 text-2xl shadow-lg`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: {
                    rotate: {
                      duration: 0.2,
                      repeat: 1,
                      repeatType: "reverse"
                    }
                  }
                }}
              >
                {feature.icon}
              </motion.div>

              {/* Feature Content */}
              <motion.h3 
                className="text-xl font-bold font-space mb-3 bg-gradient-to-r 
                         from-[hsl(var(--purple-main))] to-[hsl(var(--purple-light))]
                         bg-clip-text text-transparent"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.1 }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-[hsl(var(--purple-main)/0.8)] leading-relaxed">
                {feature.description}
              </p>

              {/* Enhanced Hover Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--purple-main)/0.1)] 
                          to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
                initial={false}
                whileHover={{
                  background: [
                    "linear-gradient(45deg, hsla(var(--purple-main)/0.1) 0%, transparent 100%)",
                    "linear-gradient(45deg, hsla(var(--purple-light)/0.1) 0%, transparent 100%)"
                  ]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action with snappy animation */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={SPRING}
        >
          <motion.button 
            className="button-primary"
            whileHover={{ 
              scale: 1.05,
              transition: HOVER_SPRING
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
} 