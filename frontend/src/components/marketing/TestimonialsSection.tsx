'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Operations Director',
    company: 'Grand Hyatt Singapore',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3',
    quote: 'The language switching is seamless. Our international guests are amazed when the AI adapts to their preferred language mid-conversation.',
    metrics: {
      languages: '12',
      callsHandled: '15k+',
      satisfaction: '98%'
    }
  },
  {
    name: 'Marcus Schmidt',
    role: 'CTO',
    company: 'TechVision GmbH',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
    quote: 'Integration took minutes, not months. The AI handles our global support calls with incredible accuracy and cultural awareness.',
    metrics: {
      languages: '8',
      callsHandled: '25k+',
      satisfaction: '99%'
    }
  },
  {
    name: 'Elena Rodriguez',
    role: 'Guest Services Manager',
    company: 'Ritz-Carlton Dubai',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
    quote: 'Our guests love the natural conversations. The AI understands context perfectly and switches between Arabic and English effortlessly.',
    metrics: {
      languages: '6',
      callsHandled: '10k+',
      satisfaction: '97%'
    }
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[length:20px_20px]" />
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
            <i className="fas fa-star text-yellow-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Customer Success Stories
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
            Trusted by Global Businesses
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.3 }}
          >
            See how businesses are transforming their customer service with KOKO AI
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl 
                       transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Testimonial Card */}
              <div className="p-8">
                {/* Quote */}
                <div className="mb-8">
                  <i className="fas fa-quote-left text-4xl text-purple-200" />
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                                    bg-clip-text text-transparent">
                        {testimonial.metrics.languages}
                      </div>
                      <div className="text-sm text-gray-500">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                                    bg-clip-text text-transparent">
                        {testimonial.metrics.callsHandled}
                      </div>
                      <div className="text-sm text-gray-500">Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                                    bg-clip-text text-transparent">
                        {testimonial.metrics.satisfaction}
                      </div>
                      <div className="text-sm text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/20 
                           rounded-2xl transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Global Stats */}
        <motion.div
          className="mt-20 py-12 px-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 
                   backdrop-blur-sm rounded-2xl border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1M+', label: 'Calls Handled' },
              { value: '95+', label: 'Languages' },
              { value: '99.9%', label: 'Uptime' },
              { value: '98%', label: 'Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.5 + index * 0.1 }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                              bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 