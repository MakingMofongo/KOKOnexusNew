import { useEffect, useState } from 'react';
import { PhoneNumber } from '@/types/phoneNumber';
import { PhoneNumberService } from '@/services/phoneNumberService';
import { VAPI_TOKEN } from '@/config';

export default function PhoneNumberList() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const service = new PhoneNumberService(VAPI_TOKEN);
        const result = await service.listPhoneNumbers({ limit: 100 });

        if (result.success && result.data) {
          setPhoneNumbers(result.data);
        } else {
          setError(result.error || 'Failed to fetch phone numbers');
        }
      } catch (err) {
        setError('An error occurred while fetching phone numbers');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, []);

  if (loading) {
    return <div>Loading phone numbers...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (phoneNumbers.length === 0) {
    return <div>No phone numbers found</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Phone Numbers</h2>
      <div className="grid gap-4">
        {phoneNumbers.map((number) => (
          <div
            key={number.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {number.name || 'Unnamed'} ({number.phoneNumber})
                </h3>
                <p className="text-sm text-gray-500">ID: {number.id}</p>
                {number.assistantId && (
                  <p className="text-sm text-gray-500">
                    Assistant: {number.assistantId}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  number.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {number.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Provider: {number.provider}</p>
              <p>Created: {new Date(number.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 