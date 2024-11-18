'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { 
  CheckCircleIcon, 
  PhoneIcon, 
  BoltIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  LanguageIcon,
  SpeakerWaveIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export function DeploymentSummary() {
  const { 
    deploymentResult, 
    error, 
    isDeploying,
    businessConfig,
    selectedNumber,
    selectedVoice,
    selectedTemplate,
    deploy
  } = useDeploymentStore()

  // Pre-deployment configuration review
  if (!isDeploying && !error && !deploymentResult?.success) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Ready to Deploy</h2>
            <p className="text-purple-100 mt-1">Review your configuration before deployment</p>
          </div>

          {/* Configuration Summary */}
          <div className="p-8 space-y-8">
            {/* Business Details */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-4">
                <BuildingOfficeIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Business Details</h3>
                  <p className="text-gray-600">{businessConfig.businessName || 'AI Assistant'}</p>
                  <p className="text-gray-600">{businessConfig.industry}</p>
                  <p className="text-gray-600">{businessConfig.region}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <LanguageIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Language & Tone</h3>
                  <p className="text-gray-600">Primary: {businessConfig.languages?.[0] || 'English'}</p>
                  <p className="text-gray-600">Tone: {businessConfig.tone || 'Professional'}</p>
                </div>
              </div>
            </motion.div>

            {/* Template & Voice */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-4">
                <BoltIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Template</h3>
                  <p className="text-gray-600">{selectedTemplate || 'Default Template'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <SpeakerWaveIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Voice Configuration</h3>
                  <p className="text-gray-600">{selectedVoice?.name || 'Default Voice'}</p>
                  <p className="text-sm text-gray-500">Provider: {selectedVoice?.provider}</p>
                </div>
              </div>
            </motion.div>

            {/* Phone Number & Hours */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-4">
                <PhoneIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Number</h3>
                  <p className="text-gray-600 font-mono">{selectedNumber?.number}</p>
                  <p className="text-sm text-gray-500">{selectedNumber?.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ClockIcon className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">{businessConfig.businessHours?.timezone}</p>
                  {businessConfig.businessHours?.schedule.map((schedule, index) => (
                    <p key={index} className="text-sm text-gray-500">
                      {schedule.days.join(', ')}: {schedule.hours}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Deploy Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.4 }}
              className="mt-8 flex flex-col items-center"
            >
              <button
                onClick={() => deploy()}
                className="group relative w-full md:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                <RocketLaunchIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Deploy Assistant
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Your assistant will be ready in just a few moments
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isDeploying) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600">Deploying your AI assistant...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-red-700 font-semibold mb-2">Deployment Failed</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => useDeploymentStore.getState().reset()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!deploymentResult?.success) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="max-w-3xl mx-auto"
    >
      {/* Success Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...SPRING, delay: 0.2 }}
          className="inline-block p-3 bg-green-100 rounded-full mb-4"
        >
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="heading-3 text-gray-900 mb-2">Deployment Successful!</h2>
        <p className="text-gray-600">Your AI assistant is ready to take calls</p>
      </div>

      {/* Deployment Details */}
      <div className="grid gap-6 mb-8">
        {/* Phone Number */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING, delay: 0.3 }}
          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <PhoneIcon className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone Number</h3>
              <p className="text-lg text-gray-700">{selectedNumber?.number}</p>
              <p className="text-sm text-gray-500">{selectedNumber?.location}</p>
            </div>
          </div>
        </motion.div>

        {/* Assistant Details */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING, delay: 0.4 }}
          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <BoltIcon className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Assistant Configuration</h3>
              <p className="text-gray-700">Voice: {selectedVoice?.name}</p>
              <p className="text-gray-700">Industry: {businessConfig.industry}</p>
              <p className="text-gray-700">Business Name: {businessConfig.businessName || 'AI Assistant'}</p>
            </div>
          </div>
        </motion.div>

        {/* Business Hours */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING, delay: 0.5 }}
          className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <ClockIcon className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
              <p className="text-gray-700">Timezone: {businessConfig.businessHours?.timezone}</p>
              {businessConfig.businessHours?.schedule.map((schedule, index) => (
                <p key={index} className="text-gray-600 text-sm">
                  {schedule.days.join(', ')}: {schedule.hours}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Start Guide</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Share your new phone number with your team</li>
          <li>Make a test call to verify the setup</li>
          <li>Monitor call analytics in your dashboard</li>
          <li>Adjust assistant settings as needed</li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => useDeploymentStore.getState().reset()}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Deploy Another
        </button>
      </div>
    </motion.div>
  )
} 