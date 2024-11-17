'use client'

import React, { useState } from 'react'
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
}

interface PricingInfo {
  priceUnit: string;
  prices: Array<{
    numberType: string;
    basePrice: string;
    currentPrice: string;
  }>;
}

export function PhoneNumberSelector() {
  const { setNumber, setStep, businessConfig } = useDeploymentStore()
  const [country, setCountry] = useState('US')
  const [areaCode, setAreaCode] = useState('')
  const [numberType, setNumberType] = useState<'local' | 'tollfree'>('local')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([])
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [pricing, setPricing] = useState<PricingInfo | null>(null)
  const [confirmPrice, setConfirmPrice] = useState('')
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false)

  // Fetch available numbers and pricing
  const searchNumbers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/phone-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          type: numberType,
          areaCode: areaCode || undefined
        })
      })

      const data = await response.json()
      
      if (!data.success) {
        console.error('Failed to fetch numbers:', data.error)
        throw new Error(data.error)
      }

      setAvailableNumbers(data.numbers)
      setPricing(data.pricing)
    } catch (err) {
      console.error('Search numbers error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch numbers')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle number purchase
  const handlePurchase = async () => {
    if (!selectedNumber) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/phone-numbers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: selectedNumber.phoneNumber,
          assistantId: businessConfig.assistantId
        })
      })

      const data = await response.json()
      
      if (!data.success) {
        console.error('Failed to purchase number:', data.error)
        throw new Error(data.error)
      }

      setNumber({
        number: selectedNumber.phoneNumber,
        location: `${selectedNumber.locality}, ${selectedNumber.region}`
      })
      setStep('deploy')
    } catch (err) {
      console.error('Purchase number error:', err)
      setError(err instanceof Error ? err.message : 'Failed to purchase number')
    } finally {
      setIsLoading(false)
    }
  }

  // Get price for selected number type
  const getSelectedPrice = () => {
    if (!pricing?.prices) return null
    const normalizedType = numberType.toLowerCase().trim()
    return pricing.prices.find(p => {
      const isExactMatch = p.numberType === normalizedType
      const isTollFreeMatch = (normalizedType === 'tollfree' && p.numberType === 'toll free') ||
                             (normalizedType === 'toll free' && p.numberType === 'tollfree')
      const isLocalMatch = p.numberType === 'local' && normalizedType === 'local'
      
      return isExactMatch || isTollFreeMatch || isLocalMatch
    })
  }

  return (
    <div className="space-y-8">
      {/* Search Controls */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            className="w-full boxy-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Number Type</label>
          <select
            className="w-full boxy-input"
            value={numberType}
            onChange={(e) => setNumberType(e.target.value as 'local' | 'tollfree')}
          >
            <option value="local">Local</option>
            <option value="tollfree">Toll Free</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Area Code (Optional)</label>
          <input
            type="text"
            className="w-full boxy-input"
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
            placeholder="e.g. 415"
            maxLength={3}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button 
          onClick={searchNumbers}
          disabled={isLoading}
          className="boxy-button-filled min-w-[200px]"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin mr-2" />
          ) : (
            <i className="fas fa-search mr-2" />
          )}
          Search Numbers
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 border-[3px] border-red-500 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* Pricing Information */}
      {pricing?.prices && pricing.prices.length > 0 && (
        <motion.div
          className="p-6 border-[3px] border-purple-600 bg-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <h3 className="font-bold text-lg mb-4">📞 Phone Number Pricing</h3>
          <div className="space-y-4">
            {pricing.prices.map((price) => (
              <div key={price.numberType} className="flex justify-between items-center p-4 bg-white border-[2px] border-purple-200">
                <span className="font-medium">{price.numberType}</span>
                <span className="text-purple-600">{pricing.priceUnit} {price.currentPrice}/month</span>
              </div>
            ))}
            <div className="mt-4 text-sm text-gray-600">
              <div className="font-medium">⚠️ Additional charges:</div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Voice calls: Varies by destination</li>
                <li>SMS messages: Varies by destination</li>
                <li>Additional features may incur extra costs</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Available Numbers */}
      {availableNumbers && availableNumbers.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={SPRING}
        >
          <h3 className="font-bold text-lg">Available Numbers</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {availableNumbers.map((number) => (
              <motion.button
                key={number.phoneNumber}
                className={`p-6 text-left transition-all duration-200 group
                         ${selectedNumber?.phoneNumber === number.phoneNumber 
                           ? 'border-[3px] border-purple-600 bg-purple-50' 
                           : 'border-[3px] border-gray-200 hover:border-purple-300'}`}
                onClick={() => {
                  setSelectedNumber(number)
                  setShowPurchaseConfirm(false)
                  setConfirmPrice('')
                }}
                whileHover={{ scale: 1.02 }}
                transition={SPRING}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border-2 border-purple-600 flex items-center justify-center">
                    <i className="fas fa-phone text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{number.friendlyName}</h4>
                    <p className="text-sm text-gray-600">{number.locality}, {number.region}</p>
                    <div className="mt-2 flex gap-2">
                      {number.capabilities.voice && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600">Voice</span>
                      )}
                      {number.capabilities.SMS && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600">SMS</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Purchase Confirmation */}
      {selectedNumber && !showPurchaseConfirm && (
        <motion.div
          className="p-6 border-[3px] border-purple-600 bg-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <h3 className="font-bold text-lg mb-4">Confirm Purchase</h3>
          <p className="text-gray-600 mb-4">
            To confirm the purchase, please enter the monthly price: {getSelectedPrice()?.currentPrice}
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              className="boxy-input flex-1"
              value={confirmPrice}
              onChange={(e) => setConfirmPrice(e.target.value)}
              placeholder="Enter price to confirm"
            />
            <button
              className="boxy-button-filled"
              disabled={confirmPrice !== getSelectedPrice()?.currentPrice}
              onClick={() => setShowPurchaseConfirm(true)}
            >
              Confirm Price
            </button>
          </div>
        </motion.div>
      )}

      {/* Final Purchase Confirmation */}
      {showPurchaseConfirm && (
        <motion.div
          className="p-6 border-[3px] border-purple-600 bg-purple-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <h3 className="font-bold text-lg mb-4">Final Confirmation</h3>
          <p className="text-gray-600 mb-4">
            Type "PURCHASE" to confirm you want to buy this number:
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              className="boxy-input flex-1"
              placeholder='Type "PURCHASE"'
              onChange={(e) => {
                if (e.target.value === 'PURCHASE') {
                  handlePurchase()
                }
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button 
          onClick={() => setStep('voice')}
          className="boxy-button"
        >
          <i className="fas fa-arrow-left mr-2" />
          Back
        </button>
        <button
          onClick={() => setStep('deploy')}
          disabled={!selectedNumber}
          className={`boxy-button-filled ${!selectedNumber && 'opacity-50 cursor-not-allowed'}`}
        >
          Continue
          <i className="fas fa-arrow-right ml-2" />
        </button>
      </div>
    </div>
  )
} 