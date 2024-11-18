import { useEffect, useState } from 'react';

interface PhoneNumber {
  id: string;
  orgId: string;
  assistantId?: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  name?: string;
  provider: string;
}

interface PhoneNumberResponse {
  success: boolean;
  data: {
    success: boolean;
    data: PhoneNumber[];
  };
}

export default function PhoneNumberList() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch('/api/test');
        const result: PhoneNumberResponse = await response.json();
        
        if (result.success && result.data.success) {
          setPhoneNumbers(result.data.data);
        } else {
          setError('Failed to fetch phone numbers');
        }
      } catch (error) {
        console.error('Error fetching numbers:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading phone numbers...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Existing Phone Numbers ({phoneNumbers.length})
        </h3>
        {phoneNumbers.length === 0 ? (
          <p className="text-gray-500">No phone numbers found.</p>
        ) : (
          phoneNumbers.map((number) => (
            <div
              key={number.id}
              className="border rounded-lg p-4 mb-4 last:mb-0 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {number.name || 'Unnamed Number'}
                  </h4>
                  <p className="text-gray-600 mt-1 font-mono">
                    {number.number}
                  </p>
                  {number.assistantId && (
                    <p className="text-sm text-gray-500">
                      Assistant: {number.assistantId}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Provider: {number.provider}</p>
                <p>Created: {new Date(number.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 