'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function FloatingCTA() {
  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <a 
        href="tel:+17755713834"
        className="flex items-center gap-2 px-6 py-3 bg-koko-600 text-white rounded-full 
                 shadow-lg hover:bg-koko-700 transition-all group"
      >
        <i className="fas fa-phone-volume animate-pulse"></i>
        <span>Try Live Demo</span>
      </a>
    </motion.div>
  )
} 