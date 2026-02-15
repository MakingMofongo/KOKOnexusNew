'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <motion.div 
          className="relative bg-white border-[3px] border-purple-600 p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 grid-bg opacity-5" />

          {/* Sharp Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-600/80 via-purple-600/20 to-transparent" />
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-purple-600/80 via-purple-600/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-purple-600/80 via-purple-600/20 to-transparent" />
            <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-purple-600/80 via-purple-600/20 to-transparent" />
          </div>

          {/* Content Grid */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <motion.div
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 border-[3px] border-purple-600"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.1 }}
              >
                <i className="fas fa-rocket text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  Launch Your AI Assistant
                </span>
              </motion.div>

              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-purple-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.2 }}
              >
                Ready to Transform Your Business?
              </motion.h2>

              <motion.p 
                className="text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.3 }}
              >
                Join the future of customer service with our AI voice assistants. 
                Deploy in minutes, scale globally.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.4 }}
              >
                <Link href="/deploy" 
                      className="boxy-button-filled group">
                  <i className="fas fa-rocket mr-2 group-hover:animate-pulse" />
                  Deploy Now
                </Link>
                <Link href="/contact" 
                      className="boxy-button">
                  <i className="fas fa-envelope mr-2" />
                  Contact Sales
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex items-center gap-8 pt-8 border-t-[3px] border-purple-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-check text-purple-600 text-xl" />
                  <span className="text-gray-600">SOC2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-server text-purple-600 text-xl" />
                  <span className="text-gray-600">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-headset text-purple-600 text-xl" />
                  <span className="text-gray-600">24/7 Support</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2min', label: 'Average Deploy Time', icon: 'fa-clock' },
                { value: '15+', label: 'Industry Templates', icon: 'fa-layer-group' },
                { value: '95+', label: 'Languages', icon: 'fa-language' },
                { value: '1M+', label: 'Calls Handled', icon: 'fa-phone-volume' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-6 bg-purple-50 border-[3px] border-purple-600 group 
                           hover:bg-purple-100 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: 0.6 + index * 0.1 }}
                >
                  <i className={`fas ${stat.icon} text-2xl text-purple-600 group-hover:scale-110 
                              transition-transform duration-300 mb-4`} />
                  <div className="text-3xl font-bold text-purple-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Banner */}
        <motion.div
          className="mt-8 p-4 border-[3px] border-white bg-white/10 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <i className="fas fa-phone-volume text-white text-xl animate-pulse" />
            <span className="text-white">Try our live demo: +1 (775) 571-3834</span>
          </div>
          <button 
            onClick={() => window.location.href='tel:+17755713834'}
            className="px-6 py-2 bg-white text-purple-600 font-bold border-[3px] border-white 
                     hover:bg-transparent hover:text-white transition-all duration-200"
          >
            Call Now
          </button>
        </motion.div>
      </div>
    </section>
  )
} 