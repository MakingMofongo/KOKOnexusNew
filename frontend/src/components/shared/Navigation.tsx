'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

export function Navigation() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 500) {
      setHidden(true)
      setMobileMenuOpen(false)
    } else {
      setHidden(false)
    }
    setScrolled(latest > 50)
  })

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                ${scrolled ? 'bg-white/95 border-b-[3px] border-purple-600' : 'bg-white/80'} 
                backdrop-blur-md`}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-purple-600">KOKO</span>
              <span className="text-gray-900">AI</span>
            </div>
            <div className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 border-[2px] border-purple-600">
              BETA
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors">
                Sign In
              </Link>
              <Link 
                href="/dashboard" 
                className="px-6 py-2 bg-white border-[3px] border-purple-600 text-purple-600 
                         hover:bg-purple-50 transition-colors transform hover:translate-x-[2px] 
                         hover:translate-y-[2px] flex items-center gap-2"
              >
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/deploy" 
                className="px-6 py-2 bg-purple-600 text-white border-[3px] border-purple-600 
                         hover:bg-purple-700 transition-colors transform hover:translate-x-[2px] 
                         hover:translate-y-[2px] flex items-center gap-2"
              >
                <i className="fas fa-rocket"></i>
                <span>Deploy Console</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden bg-white border-[3px] border-purple-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-purple-600`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div 
        className="md:hidden overflow-hidden"
        initial={false}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t-[3px] border-purple-600">
          <Link href="#features" className="block px-3 py-2 text-gray-600 hover:bg-purple-50">Features</Link>
          <Link href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:bg-purple-50">How It Works</Link>
          <Link href="#pricing" className="block px-3 py-2 text-gray-600 hover:bg-purple-50">Pricing</Link>
          <div className="mt-4 space-y-2 border-t-[3px] border-purple-100 pt-4">
            <Link 
              href="/login" 
              className="block w-full px-4 py-2 text-center text-purple-600 border-[3px] border-purple-600 
                       hover:bg-purple-50"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="block w-full px-4 py-2 text-center bg-white border-[3px] border-purple-600 
                       text-purple-600 hover:bg-purple-50"
            >
              <i className="fas fa-chart-line mr-2"></i>
              Dashboard
            </Link>
            <Link 
              href="/deploy" 
              className="block w-full px-4 py-2 text-center bg-purple-600 text-white border-[3px] 
                       border-purple-600 hover:bg-purple-700"
            >
              <i className="fas fa-rocket mr-2"></i>
              Deploy Console
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  )
} 