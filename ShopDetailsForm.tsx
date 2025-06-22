import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store } from 'lucide-react';
import { ShopDetails } from '@/types/invoice';
import { ShopProfileManager } from './ShopProfileManager';

interface ShopDetailsFormProps {
  shopDetails: ShopDetails;
  onShopDetailsChange: (details: ShopDetails) => void;
}

export function ShopDetailsForm({ shopDetails, onShopDetailsChange }: ShopDetailsFormProps) {
  const updateField = (field: keyof ShopDetails, value: string) => {
    onShopDetailsChange({ ...shopDetails, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Store className="text-primary mr-2" size={20} />
          Shop Details
        </h2>
        <ShopProfileManager 
          currentShopDetails={shopDetails}
          onLoadProfile={onShopDetailsChange}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name *
          </Label>
          <Input
            id="shopName"
            type="text"
            value={shopDetails.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter your shop name"
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Address *
          </Label>
          <Textarea
            id="shopAddress"
            value={shopDetails.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Enter complete shop address"
            rows={3}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="shopGSTIN" className="block text-sm font-medium text-gray-700 mb-1">
            GSTIN
          </Label>
          <Input
            id="shopGSTIN"
            type="text"
            value={shopDetails.gstin}
            onChange={(e) => updateField('gstin', e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
