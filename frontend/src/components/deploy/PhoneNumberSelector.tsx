'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '@/lib/constants/animations'
import { useDeploymentStore } from '@/lib/store/deploymentStore'

interface PhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  isoCountry: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
  pricing: {
    basePrice: string;
    currentPrice: string;
    priceUnit: string;
    voicePrice: string;
    additionalInfo: {
      voiceInbound: string;
      voiceOutbound: string;
      smsInbound: string;
      smsOutbound: string;
    }
  };
}

interface PhoneNumberSelectorProps {
  onSelect?: (number: PhoneNumber) => void;
  country?: string;
  type?: 'local' | 'tollfree';
}

interface Assistant {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ExistingPhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  isoCountry: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
  status: string;
  assistantId?: string;
  createdAt?: string;
  provider?: string;
}

export function PhoneNumberSelector({ 
  onSelect, 
  country = 'US', 
  type = 'local' 
}: PhoneNumberSelectorProps) {
  const { setNumber, setStep } = useDeploymentStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numbers, setNumbers] = useState<PhoneNumber[]>([])
  const [existingNumbers, setExistingNumbers] = useState<ExistingPhoneNumber[]>([])
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false)
  const [currentCountry, setCurrentCountry] = useState(country)
  const [currentType, setCurrentType] = useState(type)
  const [showExisting, setShowExisting] = useState(false)
  const fetchController = React.useRef<AbortController | null>(null)
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(null)
  const [loadingAssistants, setLoadingAssistants] = useState(true)
  const [selectedExistingNumber, setSelectedExistingNumber] = useState<ExistingPhoneNumber | null>(null)

  // Fetch existing numbers
  useEffect(() => {
    const fetchExistingNumbers = async () => {
      try {
        const response = await fetch('/api/phone-numbers/list')
        const result = await response.json()
        if (result.success) {
          setExistingNumbers(result.data)
        }
      } catch (err) {
        console.error('Error fetching existing numbers:', err)
      }
    }
    fetchExistingNumbers()
  }, [])

  // Fetch assistants
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoadingAssistants(true)
        const response = await fetch('/api/vapi/assistants')
        const result = await response.json()
        if (result.success) {
          setAssistants(result.assistants)
        }
      } catch (err) {
        console.error('Error fetching assistants:', err)
      } finally {
        setLoadingAssistants(false)
      }
    }

    fetchAssistants()
  }, [])

  const fetchNumbers = async (abortSignal?: AbortSignal) => {
    if (fetchController.current) {
      fetchController.current.abort()
    }
    
    fetchController.current = new AbortController()
    const signal = abortSignal || fetchController.current.signal

    try {
      setLoading(true)
      setError(null)
      setSelectedNumber(null)
      setShowPurchaseConfirm(false)

      const response = await fetch(
        `/api/available-numbers?country=${currentCountry}&type=${currentType}&limit=10`,
        { signal }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch numbers')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch numbers')
      }

      setNumbers(result.data || [])
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error fetching numbers:', err)
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNumbers()
    return () => {
      if (fetchController.current) {
        fetchController.current.abort()
      }
    }
  }, [currentCountry, currentType])

  const handleAssignNumber = async (number: ExistingPhoneNumber) => {
    try {
      setLoading(true);
      setError(null);

      // First create the assistant with the business config
      const assistantResponse = await fetch('/api/deploy/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useDeploymentStore.getState().businessConfig)
      });

      const assistantResult = await assistantResponse.json();
      
      if (!assistantResult.success) {
        throw new Error(assistantResult.error || 'Failed to create assistant');
      }

      // Store the assistant ID
      useDeploymentStore.getState().setAssistantId(assistantResult.data.id);

      // Set the number in store first (this will be used in deployment)
      setNumber({
        number: number.phoneNumber,
        location: `${number.locality}, ${number.region}`
      });

      // Move to deploy step - the actual number update will happen during deployment
      setStep('deploy');

    } catch (err) {
      console.error('Error assigning number:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign number');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseNumber = async () => {
    if (!selectedNumber) {
      setError('Please select a number first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First create the assistant
      const assistantResponse = await fetch('/api/deploy/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useDeploymentStore.getState().businessConfig)
      });

      const assistantResult = await assistantResponse.json();
      
      if (!assistantResult.success) {
        throw new Error(assistantResult.error || 'Failed to create assistant');
      }

      // Store the assistant ID
      useDeploymentStore.getState().setAssistantId(assistantResult.data.id);

      // Purchase the number
      const purchaseResponse = await fetch('/api/purchase-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: selectedNumber.phoneNumber
        })
      });

      const purchaseResult = await purchaseResponse.json();

      if (!purchaseResult.success) {
        throw new Error(purchaseResult.error || 'Failed to purchase number');
      }

      // Set the number in store
      setNumber({
        number: selectedNumber.phoneNumber,
        location: `${selectedNumber.locality}, ${selectedNumber.region}`
      });

      // Move to deploy step - the number will be updated with assistant ID during deployment
      setStep('deploy');

    } catch (err) {
      console.error('Purchase error:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <h3 className="text-lg font-semibold mb-2">Phone Number Selection</h3>
        <p className="text-gray-600">
          Choose a phone number for your AI assistant. This number will be used for:
        </p>
        <ul className="mt-2 space-y-1 text-gray-600">
          <li className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2" />
            Incoming customer calls
          </li>
          <li className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2" />
            Automated responses
          </li>
          <li className="flex items-center">
            <i className="fas fa-check text-green-500 mr-2" />
            Call forwarding when needed
          </li>
        </ul>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select 
              value={currentCountry}
              onChange={(e) => setCurrentCountry(e.target.value)}
              className="boxy-input min-w-[150px]"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>

            <select 
              value={currentType}
              onChange={(e) => setCurrentType(e.target.value as 'local' | 'tollfree')}
              className="boxy-input min-w-[150px]"
            >
              <option value="local">Local Number</option>
              <option value="tollfree">Toll Free Number</option>
            </select>

            <button 
              onClick={() => fetchNumbers()}
              className="boxy-button-ghost"
              disabled={loading}
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setShowExisting(!showExisting)}
            className="boxy-button-ghost"
          >
            {showExisting ? 'Show Available' : 'Show Existing'}
            <i className={`fas fa-chevron-${showExisting ? 'up' : 'down'} ml-2`} />
          </button>
        </div>

        {error && (
          <div className="p-4 border-[3px] border-red-500 bg-red-50 text-red-600 rounded-lg">
            <div className="flex">
              <i className="fas fa-exclamation-circle mt-1" />
              <div className="ml-3">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Number Lists */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="space-y-4"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : showExisting ? (
          // Existing Numbers
          <div className="grid gap-4">
            {existingNumbers.map(number => (
              <motion.button
                key={number.phoneNumber}
                className={`p-6 text-left transition-all duration-200 rounded-lg w-full
                         ${selectedExistingNumber?.phoneNumber === number.phoneNumber 
                           ? 'border-[3px] border-purple-600 bg-purple-50' 
                           : 'border-[3px] border-gray-200 hover:border-purple-300'}`}
                onClick={() => handleAssignNumber(number)}
                whileHover={{ scale: 1.02 }}
                transition={SPRING}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{number.phoneNumber}</h3>
                    <p className="text-sm text-gray-600">{number.friendlyName}</p>
                    {number.assistantId && (
                      <p className="text-xs text-gray-500">Assistant ID: {number.assistantId}</p>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {number.status || 'Active'}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {number.capabilities?.voice && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Voice
                    </span>
                  )}
                  {number.capabilities?.SMS && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      SMS
                    </span>
                  )}
                  {number.capabilities?.MMS && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      MMS
                    </span>
                  )}
                </div>
                {number.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(number.createdAt).toLocaleDateString()}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          // Available Numbers
          <div className="grid gap-4">
            {numbers.map(number => (
              <motion.button
                key={number.phoneNumber}
                className={`p-6 text-left transition-all duration-200 rounded-lg
                         ${selectedNumber?.phoneNumber === number.phoneNumber 
                           ? 'border-[3px] border-purple-600 bg-purple-50' 
                           : 'border-[3px] border-gray-200 hover:border-purple-300'}`}
                onClick={() => {
                  setSelectedNumber(number)
                  setShowPurchaseConfirm(true)
                }}
                whileHover={{ scale: 1.02 }}
                transition={SPRING}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-purple-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-phone text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{number.phoneNumber}</h4>
                        <p className="text-sm text-gray-600">
                          {number.locality} {number.region && `• ${number.region}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">
                          {number.pricing.priceUnit} {number.pricing.currentPrice}
                          <span className="text-sm font-normal text-gray-600">/month</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {number.pricing.additionalInfo.voiceOutbound}/min calls
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {number.capabilities?.voice && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          Voice
                        </span>
                      )}
                      {number.capabilities?.SMS && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          SMS
                        </span>
                      )}
                      {number.capabilities?.MMS && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          MMS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Purchase Confirmation Modal */}
      {showPurchaseConfirm && selectedNumber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING}
          >
            <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
            
            <div className="space-y-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="text-xl font-semibold">{selectedNumber.phoneNumber}</h4>
                <p className="text-sm text-gray-600">
                  {selectedNumber.locality} {selectedNumber.region && `• ${selectedNumber.region}`}
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900">Pricing Details</h5>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span>Monthly Number Rental</span>
                    <span className="font-semibold">
                      {selectedNumber.pricing.priceUnit} {selectedNumber.pricing.currentPrice}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Voice Calls (Outbound)</span>
                    <span>{selectedNumber.pricing.priceUnit} {selectedNumber.pricing.additionalInfo.voiceOutbound}/min</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Voice Calls (Inbound)</span>
                    <span>{selectedNumber.pricing.priceUnit} {selectedNumber.pricing.additionalInfo.voiceInbound}/min</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>SMS (Outbound)</span>
                    <span>{selectedNumber.pricing.priceUnit} {selectedNumber.pricing.additionalInfo.smsOutbound}/msg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>SMS (Inbound)</span>
                    <span>{selectedNumber.pricing.priceUnit} {selectedNumber.pricing.additionalInfo.smsInbound}/msg</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                <div className="font-medium text-yellow-800">Important Note:</div>
                <p className="mt-1 text-yellow-700">
                  These charges will be billed to your Twilio account. Additional usage charges may apply.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Assistant
                </label>
                <select
                  className="boxy-input w-full"
                  value={selectedAssistant || ''}
                  onChange={(e) => setSelectedAssistant(e.target.value)}
                  disabled={loadingAssistants}
                >
                  <option value="">Select an assistant...</option>
                  {assistants.map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name} ({assistant.type})
                    </option>
                  ))}
                </select>
                {loadingAssistants && (
                  <p className="text-sm text-gray-500">Loading assistants...</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 boxy-button"
                  onClick={() => {
                    setShowPurchaseConfirm(false)
                    setSelectedNumber(null)
                    setSelectedAssistant(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 boxy-button-filled"
                  onClick={handlePurchaseNumber}
                  disabled={loading || !selectedAssistant}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    'Purchase Number'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button 
          onClick={() => setStep('voice')}
          className="boxy-button"
          disabled={loading}
        >
          <i className="fas fa-arrow-left mr-2" />
          Back
        </button>
      </div>
    </div>
  )
} 