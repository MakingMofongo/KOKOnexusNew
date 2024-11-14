'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { SPRING } from '@/lib/constants/animations'

export function DeploymentSummary() {
  const store = useDeploymentStore()
  const [isDeploying, setIsDeploying] = React.useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      await store.deploy()
      // Success! Show success state
    } catch (error) {
      // Show error state
      console.error('Deployment failed:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  if (store.deploymentStatus === 'success') {
    return (
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
      >
        <div className="glass-panel p-8 mb-8">
          <motion.div 
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={SPRING}
          >
            ✓
          </motion.div>
          <h2 className="heading-2 mb-4">Deployment Successful!</h2>
          <p className="body-large mb-8">Your AI assistant is ready to take calls</p>
          
          {store.deploymentResult && (
            <div className="text-left space-y-4">
              <div className="glass-panel p-4">
                <p className="text-sm text-[hsl(var(--purple-main)/0.7)] mb-1">Phone Number</p>
                <p className="font-mono text-lg">{store.deploymentResult.assistant.phoneNumber}</p>
              </div>
              <div className="glass-panel p-4">
                <p className="text-sm text-[hsl(var(--purple-main)/0.7)] mb-1">Assistant ID</p>
                <p className="font-mono text-lg">{store.deploymentResult.assistant.id}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button className="button-primary" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
          <button className="button-secondary" onClick={store.reset}>
            Deploy Another
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-8 mb-8">
        <h2 className="heading-3 mb-6">Review Configuration</h2>
        
        {/* Template */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">Template</h3>
          <div className="glass-panel p-4">
            <p className="text-[hsl(var(--purple-main))]">
              {store.selectedTemplate} Template
            </p>
          </div>
        </div>

        {/* Voice */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">Voice</h3>
          <div className="glass-panel p-4">
            <p className="text-[hsl(var(--purple-main))]">
              {store.selectedVoice?.name}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">Phone Number</h3>
          <div className="glass-panel p-4">
            <p className="font-mono text-[hsl(var(--purple-main))]">
              {store.selectedNumber?.number}
            </p>
            <p className="text-sm text-[hsl(var(--purple-main)/0.7)]">
              {store.selectedNumber?.location}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          className="button-primary"
          onClick={handleDeploy}
          disabled={isDeploying}
        >
          {isDeploying ? (
            <span className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              Deploying...
            </span>
          ) : (
            'Deploy Assistant'
          )}
        </button>
      </div>
    </div>
  )
} 