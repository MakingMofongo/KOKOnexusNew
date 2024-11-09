'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function BackgroundGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Primary Gradient Orbs */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-[hsl(var(--purple-main)/0.2)] blur-[100px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          top: '10%',
          left: '20%',
        }}
      />
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full bg-[hsl(var(--purple-light)/0.15)] blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          bottom: '10%',
          right: '20%',
        }}
      />

      {/* Accent Gradients */}
      <div className="absolute inset-0 bg-[hsl(var(--white-pure))] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0),rgba(255,255,255,0.8))]" />
    </div>
  )
} 