'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Up to 500 minutes/month',
        '1 AI assistant',
        'Basic analytics',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        'Up to 2000 minutes/month',
        '3 AI assistants',
        'Advanced analytics',
        'Priority support',
        'Custom voice options'
      ]
    },
    {
      name: 'Enterprise',
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        'Unlimited minutes',
        'Unlimited assistants',
        'Enterprise analytics',
        '24/7 support',
        'Custom integration',
        'SLA guarantee'
      ]
    }
  ]

  return (
    <section className="py-20 relative overflow-hidden" id="pricing">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 geometric-pattern opacity-[0.02]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-[3px] border-purple-600 mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <i className="fas fa-tag text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              Simple Pricing
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
            Start Free, Scale as You Grow
          </motion.h2>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`${!isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              className="w-16 h-8 bg-white border-[3px] border-purple-600 p-1 relative"
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <motion.div
                className="w-6 h-4 bg-purple-600"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`${isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
              Annual (20% off)
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: index * 0.1 }}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-white border-[3px] border-purple-600 transform 
                           group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
              
              {/* Card Content */}
              <div className="relative bg-white border-[3px] border-purple-600 p-8 transform 
                           group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600">
                    /month
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-purple-600 flex items-center justify-center">
                        <i className="fas fa-check text-sm text-purple-600" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full boxy-button-filled">
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Link */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.4 }}
        >
          <a href="#faq" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700">
            <span>Have questions? Check our FAQ</span>
            <i className="fas fa-arrow-right" />
          </a>
        </motion.div>
      </div>
    </section>
  )
} 