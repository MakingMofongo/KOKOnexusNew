"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SPRING } from "@/lib/constants/animations";
import { useDeploymentStore } from "@/lib/store/deploymentStore";
import {
  PhoneIcon,
  BuildingOfficeIcon,
  GlobeAmericasIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

interface PhoneNumber {
  id: string;
  number: string;
  name?: string;
  provider: string;
  createdAt: string;
  locality?: string;
  region?: string;
}

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  country: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  price: {
    amount: number;
    currency: string;
  };
}

interface PurchaseConfirmation {
  number: AvailableNumber | null;
  isOpen: boolean;
}

export function PhoneNumberSelector() {
  const { setNumber, setStep } = useDeploymentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<
    (PhoneNumber | AvailableNumber)[]
  >([]);
  const [showExisting, setShowExisting] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [searchParams, setSearchParams] = useState({
    country: "US",
    type: "local",
    areaCode: "",
    contains: "",
  });
  const [purchaseConfirmation, setPurchaseConfirmation] =
    useState<PurchaseConfirmation>({
      number: null,
      isOpen: false,
    });

  const searchAvailableNumbers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        country: searchParams.country,
        type: searchParams.type,
        ...(searchParams.areaCode && { areaCode: searchParams.areaCode }),
        ...(searchParams.contains && { contains: searchParams.contains }),
      });

      const response = await fetch(`/api/available-numbers?${queryParams}`);
      const result = await response.json();

      if (result.success && result.data) {
        setAvailableNumbers(result.data);
      } else {
        setError(result.error || "Failed to fetch available numbers");
      }
    } catch (err) {
      setError("Failed to search for numbers");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchExistingNumbers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/phone-numbers/list");
      const result = await response.json();

      if (result.success && result.data) {
        setAvailableNumbers(result.data);
      } else {
        setError(result.error || "Failed to fetch existing numbers");
      }
    } catch (err) {
      setError("Failed to fetch existing numbers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchNumbers = async () => {
      if (!initialFetchDone) {
        if (showExisting) {
          await fetchExistingNumbers();
        } else {
          await searchAvailableNumbers();
        }
        setInitialFetchDone(true);
      }
    };

    fetchNumbers();
  }, [
    showExisting,
    searchAvailableNumbers,
    fetchExistingNumbers,
    initialFetchDone,
  ]);

  useEffect(() => {
    setInitialFetchDone(false);
  }, [searchParams, showExisting]);

  const validateBusinessConfig = () => {
    const businessConfig = useDeploymentStore.getState().businessConfig;

    if (!businessConfig.businessName?.trim()) {
      setError(
        "Business name is required. Please go back and complete the business configuration."
      );
      return false;
    }
    return true;
  };

  const handleAssignNumber = async (number: PhoneNumber) => {
    try {
      if (!validateBusinessConfig()) {
        return;
      }

      setLoading(true);
      setError(null);

      const currentState = useDeploymentStore.getState();
      const businessConfig = currentState.businessConfig;

      const assistantResponse = await fetch("/api/deploy/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessConfig.businessName,
          language: currentState.languages.primary || "en",
        }),
      });

      const assistantResult = await assistantResponse.json();

      if (!assistantResult.success) {
        throw new Error(assistantResult.error || "Failed to create assistant");
      }

      const assistantId = assistantResult.data.id;
      currentState.setAssistantId(assistantId);

      setNumber({
        id: number.id,
        number: number.number,
        location:
          number.locality && number.region
            ? `${number.locality}, ${number.region}`
            : "Unknown location",
      });

      setStep("deploy");
    } catch (err) {
      console.error("Error assigning number:", err);
      setError(err instanceof Error ? err.message : "Failed to assign number");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (number: AvailableNumber) => {
    setPurchaseConfirmation({
      number,
      isOpen: true,
    });
  };

  const handlePurchaseNumber = async (number: AvailableNumber) => {
    try {
      if (!validateBusinessConfig()) {
        return;
      }

      setLoading(true);
      setError(null);

      const currentState = useDeploymentStore.getState();
      const businessConfig = currentState.businessConfig;

      const purchaseResponse = await fetch("/api/purchase-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: number.phoneNumber,
          country: number.country,
          areaCode: searchParams.areaCode || number.phoneNumber.slice(2, 5),
          name: businessConfig.businessName,
        }),
      });

      const purchaseResult = await purchaseResponse.json();

      if (!purchaseResult.success) {
        throw new Error(purchaseResult.error || "Failed to purchase number");
      }

      setNumber({
        id: purchaseResult.data.id,
        number: number.phoneNumber,
        location: `${number.locality}, ${number.region}`,
      });

      setStep("deploy");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to purchase number"
      );
    } finally {
      setLoading(false);
      setPurchaseConfirmation({ number: null, isOpen: false });
    }
  };

  const PurchaseConfirmationModal = () => {
    if (!purchaseConfirmation.isOpen || !purchaseConfirmation.number) return null;

    const number = purchaseConfirmation.number;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={SPRING}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden"
        >
          {/* Warning Header */}
          <div className="bg-red-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
              ⚠️ WARNING: Real Purchase
            </h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Warning Message */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-lg font-bold text-red-800">
                    TEST ENVIRONMENT NOTICE
                  </h4>
                  <div className="mt-2 text-red-700 space-y-2">
                    <p className="font-bold">
                      This is a test environment, but purchases are REAL and will charge actual company funds!
                    </p>
                    <p>
                      During the testing phase, please DO NOT purchase phone numbers unless explicitly authorized by your supervisor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Number Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono text-gray-900">
                    {number.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {number.locality}, {number.region}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600">
                    ${number.price.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>

              {/* Additional Warning */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-bold text-yellow-800">
                      Confirmation Required
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      To proceed, you must:
                    </p>
                    <ol className="list-decimal ml-4 mt-2 text-sm text-yellow-700">
                      <li>Confirm you have explicit authorization to make this purchase</li>
                      <li>Type the exact monthly cost below</li>
                      <li>Type "I UNDERSTAND THIS IS A REAL PURCHASE"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type the monthly cost (${number.price.amount.toFixed(2)})
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter exact amount"
                  onChange={(e) => {
                    // Add validation logic here
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type "I UNDERSTAND THIS IS A REAL PURCHASE"
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Type confirmation message"
                  onChange={(e) => {
                    // Add validation logic here
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                onClick={() => setPurchaseConfirmation({ number: null, isOpen: false })}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchaseNumber(number)}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Confirm Real Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderNumberCard = (number: AvailableNumber) => (
    <motion.button
      key={number.phoneNumber}
      onClick={() => handlePurchaseClick(number)}
      className="group p-6 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow"
      whileHover={{ scale: 1.02 }}
      transition={SPRING}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
          <PhoneIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {number.friendlyName}
              </h3>
              <p className="text-gray-600 font-mono">{number.phoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${number.price?.amount?.toFixed(2) || "0.00"}{" "}
                {number.price?.currency || "USD"}
              </p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <GlobeAmericasIcon className="w-4 h-4" />
            <span>
              {number.locality}, {number.region}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      {/* Tab Selection */}
      <div className="flex justify-center space-x-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setShowExisting(false)}
          className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
            !showExisting
              ? "bg-white shadow text-purple-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
          Purchase New Number
        </button>
        <button
          onClick={() => setShowExisting(true)}
          className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
            showExisting
              ? "bg-white shadow text-purple-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <PhoneIcon className="w-5 h-5 mr-2" />
          Use Existing Number
        </button>
      </div>

      {/* Search Form for New Numbers */}
      {!showExisting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={searchParams.country}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number Type
              </label>
              <select
                value={searchParams.type}
                onChange={(e) =>
                  setSearchParams((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="local">Local</option>
                <option value="tollfree">Toll Free</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Code
              </label>
              <input
                type="text"
                value={searchParams.areaCode}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    areaCode: e.target.value,
                  }))
                }
                placeholder="e.g., 415"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contains
              </label>
              <input
                type="text"
                value={searchParams.contains}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    contains: e.target.value,
                  }))
                }
                placeholder="e.g., 1234"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={searchAvailableNumbers}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              )}
              Search Numbers
            </button>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-700">
              <span>{error}</span>
            </div>
          </div>
        ) : showExisting ? (
          <div className="grid gap-4">
            {availableNumbers.map((number) => {
              if (!("phoneNumber" in number)) {
                return (
                  <motion.button
                    key={number.id || number.number}
                    onClick={() => handleAssignNumber(number)}
                    className="group p-6 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow"
                    whileHover={{ scale: 1.02 }}
                    transition={SPRING}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <PhoneIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {number.name || "Unnamed Number"}
                        </h3>
                        <p className="text-gray-600 font-mono">
                          {number.number}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <GlobeAmericasIcon className="w-4 h-4" />
                          <span>{number.provider}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="grid gap-4">
            {availableNumbers.map((number) =>
              "phoneNumber" in number
                ? renderNumberCard(number as AvailableNumber)
                : null
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep("voice")}
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          disabled={loading}
        >
          Back
        </button>
      </div>

      {/* Add the confirmation modal */}
      <PurchaseConfirmationModal />
    </div>
  );
}
