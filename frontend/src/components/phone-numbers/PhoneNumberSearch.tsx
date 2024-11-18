import { useState } from 'react';
import { PhoneNumberService } from '@/services/phoneNumberService';
import { VAPI_TOKEN } from '@/config';

export default function PhoneNumberSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    country: 'US',
    type: 'local',
    areaCode: '',
    contains: ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const service = new PhoneNumberService(VAPI_TOKEN);
      const result = await service.listAvailableNumbers(searchParams);

      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        setError(result.error || 'Failed to search phone numbers');
      }
    } catch (err) {
      setError('An error occurred while searching phone numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <select
              name="country"
              value={searchParams.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number Type</label>
            <select
              name="type"
              value={searchParams.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="local">Local</option>
              <option value="tollfree">Toll Free</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Area Code</label>
            <input
              type="text"
              name="areaCode"
              value={searchParams.areaCode}
              onChange={handleInputChange}
              placeholder="e.g., 415"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contains</label>
            <input
              type="text"
              name="contains"
              value={searchParams.contains}
              onChange={handleInputChange}
              placeholder="e.g., 1234"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Numbers'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Available Numbers</h3>
          <div className="mt-4 grid gap-4">
            {searchResults.map((number) => (
              <div
                key={number.phoneNumber}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{number.phoneNumber}</p>
                    <p className="text-sm text-gray-500">
                      {number.locality || number.region}, {number.country}
                    </p>
                  </div>
                  <button
                    onClick={() => {/* Implement purchase handler */}}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 