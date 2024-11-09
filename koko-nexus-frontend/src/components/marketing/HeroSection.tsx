'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TRANSITIONS } from '@/lib/constants/animations'
import Image from 'next/image'
import Link from 'next/link'
import { BackgroundGradient } from '@/components/shared/BackgroundGradient'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <BackgroundGradient />

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="text-left relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={TRANSITIONS}
          >
            <motion.div
              className="inline-block px-4 py-2 rounded-full glass-panel mb-6
                         border border-[hsl(var(--purple-main)/0.2)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.1 }}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--purple-main))] to-[hsl(var(--purple-light))] 
                             bg-clip-text text-transparent">
                Deploy in Minutes ⚡
              </span>
            </motion.div>

            <motion.h1 
              className="heading-1 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.2 }}
            >
              Next Generation{' '}
              <span className="text-[hsl(var(--purple-main))]">
                AI Voice Assistant
              </span>
            </motion.h1>

            <motion.p 
              className="body-large mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.3 }}
            >
              Deploy intelligent voice assistants that sound natural, understand context, 
              and deliver exceptional customer experiences.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS, delay: 0.4 }}
            >
              <Link href="/deploy" className="button-primary">
                Deploy Now
              </Link>
              <button className="button-secondary">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats Section with Enhanced Design */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...TRANSITIONS, delay: 0.5 }}
            >
              {[
                { value: '2min', label: 'Average Deploy Time' },
                { value: '15+', label: 'Industry Templates' },
                { value: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-panel p-4 text-center"
                  whileHover={{ y: -2, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--purple-main))] 
                                to-[hsl(var(--purple-light))] bg-clip-text text-transparent">
                    {stat.value}
                  </h4>
                  <p className="text-sm text-[hsl(var(--purple-main)/0.7)]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Proof with Enhanced Design */}
            <motion.div 
              className="mt-12 glass-panel p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...TRANSITIONS, delay: 0.7 }}
            >
              <p className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--purple-main))] 
                           to-[hsl(var(--purple-light))] bg-clip-text text-transparent mb-4">
                Trusted by innovative companies
              </p>
              <div className="flex gap-8 items-center">
                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-8 w-24 bg-[hsl(var(--purple-ghost))] rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Preview Panel with Enhanced Design */}
          <motion.div
            className="relative lg:h-[600px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...TRANSITIONS, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-[hsl(var(--purple-ghost))] rounded-2xl overflow-hidden">
              {/* Add a preview of the deployment interface */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--purple-main)/0.1)] to-transparent" />
              <div className="relative p-6">
                <div className="glass-panel p-4 mb-4">
                  <div className="h-4 w-1/2 bg-[hsl(var(--purple-main)/0.1)] rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4">
                    <div className="h-4 w-3/4 bg-[hsl(var(--purple-main)/0.1)] rounded-full mb-2" />
                    <div className="h-4 w-1/2 bg-[hsl(var(--purple-main)/0.1)] rounded-full" />
                  </div>
                  <div className="glass-panel p-4">
                    <div className="h-4 w-3/4 bg-[hsl(var(--purple-main)/0.1)] rounded-full mb-2" />
                    <div className="h-4 w-1/2 bg-[hsl(var(--purple-main)/0.1)] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 