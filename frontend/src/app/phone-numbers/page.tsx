import PhoneNumberList from '@/components/phone-numbers/PhoneNumberList';
import PhoneNumberSearch from '@/components/phone-numbers/PhoneNumberSearch';

export default function PhoneNumbersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Phone Numbers</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Available Numbers</h2>
          <PhoneNumberSearch />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Phone Numbers</h2>
          <PhoneNumberList />
        </div>
      </div>
    </div>
  );
} 