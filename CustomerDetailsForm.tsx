import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react';
import { CustomerDetails } from '@/types/invoice';

interface CustomerDetailsFormProps {
  customerDetails: CustomerDetails;
  onCustomerDetailsChange: (details: CustomerDetails) => void;
}

export function CustomerDetailsForm({ customerDetails, onCustomerDetailsChange }: CustomerDetailsFormProps) {
  const updateField = (field: keyof CustomerDetails, value: string) => {
    onCustomerDetailsChange({ ...customerDetails, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="text-primary mr-2" size={20} />
        Customer Details
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name *
          </Label>
          <Input
            id="customerName"
            type="text"
            value={customerDetails.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter customer name"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="customerContact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </Label>
          <Input
            id="customerContact"
            type="tel"
            value={customerDetails.contact}
            onChange={(e) => updateField('contact', e.target.value)}
            placeholder="Enter mobile number"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Address
          </Label>
          <Textarea
            id="customerAddress"
            value={customerDetails.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Enter customer address"
            rows={2}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
