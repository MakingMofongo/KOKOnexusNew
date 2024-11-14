'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Documentation', href: '#docs' },
]

export function Navigation() {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass-panel bg-opacity-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-space font-bold text-[hsl(var(--purple-main))]">
          Koko Nexus
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className="text-[hsl(var(--purple-main)/0.7)] hover:text-[hsl(var(--purple-main))] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="text-[hsl(var(--purple-main)/0.7)] hover:text-[hsl(var(--purple-main))] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/deploy"
            className="button-primary"
          >
            Deploy Assistant
          </Link>
        </div>
      </nav>
    </motion.header>
  )
} 