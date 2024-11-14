'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDeploymentStore } from '@/lib/store/deploymentStore'
import { phoneNumberApi } from '@/lib/api/phoneNumber'
import { SPRING } from '@/lib/constants/animations'

interface PhoneNumber {
  number: string
  location: string
  type: 'local' | 'tollfree'
  price: number
  available: boolean
}

export function PhoneNumberSelector() {
  const [numbers, setNumbers] = React.useState<PhoneNumber[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedNumber, setSelectedNumber] = React.useState<string | null>(null)
  const [filter, setFilter] = React.useState<'all' | 'local' | 'tollfree'>('all')
  const [creatingNumber, setCreatingNumber] = React.useState(false)
  const [porting, setPorting] = React.useState(false)
  const [portNumber, setPortNumber] = React.useState('')

  const setNumber = useDeploymentStore(state => state.setNumber)
  const setStep = useDeploymentStore(state => state.setStep)

  // Fetch available numbers
  React.useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await phoneNumberApi.list()
        setNumbers(response.data)
      } catch (err) {
        setError('Failed to load phone numbers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNumbers()
  }, [])

  const handleNumberSelect = async (number: PhoneNumber) => {
    try {
      setCreatingNumber(true)
      // Create the phone number in Vapi
      const response = await phoneNumberApi.create({
        number: number.number,
        type: number.type
      })

      // Update store and move to next step
      setNumber({
        number: response.number,
        location: number.location,
        type: number.type
      })
      setSelectedNumber(number.number)
      
      setTimeout(() => {
        setStep('deploy')
      }, 500)
    } catch (err) {
      setError('Failed to create phone number')
      console.error(err)
    } finally {
      setCreatingNumber(false)
    }
  }

  const handlePortNumber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!portNumber) return

    try {
      setPorting(true)
      const response = await phoneNumberApi.port(portNumber)
      
      // Update store and move to next step
      setNumber({
        number: response.number,
        location: 'Ported Number',
        type: 'local'
      })
      
      setTimeout(() => {
        setStep('deploy')
      }, 500)
    } catch (err) {
      setError('Failed to port number')
      console.error(err)
    } finally {
      setPorting(false)
    }
  }

  const filteredNumbers = numbers.filter(num => 
    filter === 'all' ? true : num.type === filter
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <motion.div
          className="w-12 h-12 border-4 border-[hsl(var(--purple-main))] border-t-transparent rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-[hsl(var(--purple-main))]">Loading available numbers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="glass-panel p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="button-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        {['all', 'local', 'tollfree'].map((type) => (
          <motion.button
            key={type}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                       ${filter === type 
                         ? 'bg-[hsl(var(--purple-main))] text-white' 
                         : 'bg-[hsl(var(--purple-ghost))] text-[hsl(var(--purple-main))]'}`}
            onClick={() => setFilter(type as typeof filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Number List */}
      <div className="grid gap-4">
        {filteredNumbers.map((number) => (
          <motion.div
            key={number.number}
            className={`glass-panel p-6 flex items-center justify-between
                       ${selectedNumber === number.number ? 'ring-2 ring-[hsl(var(--purple-main))]' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
          >
            <div>
              <h3 className="text-xl font-mono font-bold mb-1">{number.number}</h3>
              <p className="text-[hsl(var(--purple-main)/0.7)] flex items-center gap-2">
                <span>{number.location}</span>
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--purple-main)/0.3)]" />
                <span>${number.price}/month</span>
              </p>
            </div>

            <button 
              className={`button-primary py-2 min-w-[120px]
                         ${selectedNumber === number.number ? 'bg-green-500' : ''}`}
              onClick={() => handleNumberSelect(number)}
              disabled={creatingNumber}
            >
              {creatingNumber ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : selectedNumber === number.number ? (
                'Selected ✓'
              ) : (
                'Select'
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bring Your Own Number */}
      <motion.div
        className="mt-8 glass-panel p-6"
        whileHover={{ scale: 1.02 }}
        transition={SPRING}
      >
        <h3 className="text-xl font-bold mb-2">Use Your Own Number</h3>
        <p className="text-[hsl(var(--purple-main)/0.7)] mb-4">
          Already have a phone number? Port it to our platform.
        </p>
        
        <form onSubmit={handlePortNumber} className="flex gap-4">
          <input
            type="tel"
            placeholder="+1 (555) 555-5555"
            className="flex-1 px-4 py-2 rounded-lg border border-[hsl(var(--purple-main)/0.2)] 
                     bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(var(--purple-main))]"
            value={portNumber}
            onChange={(e) => setPortNumber(e.target.value)}
            disabled={porting}
          />
          <button 
            type="submit"
            className="button-secondary"
            disabled={porting || !portNumber}
          >
            {porting ? (
              <span className="flex items-center gap-2">
                <motion.div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Porting...
              </span>
            ) : (
              'Port Number'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
} 