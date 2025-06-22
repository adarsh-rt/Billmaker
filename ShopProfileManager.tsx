import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Bookmark, Trash2, Star } from 'lucide-react';
import { shopProfileStorage, type SavedShopProfile } from '@/lib/localStorage';
import { ShopDetails } from '@/types/invoice';

interface ShopProfileManagerProps {
  currentShopDetails: ShopDetails;
  onLoadProfile: (profile: ShopDetails) => void;
  onSaveSuccess?: () => void;
}

export function ShopProfileManager({ currentShopDetails, onLoadProfile, onSaveSuccess }: ShopProfileManagerProps) {
  const [profiles, setProfiles] = useState<SavedShopProfile[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const savedProfiles = shopProfileStorage.getProfiles();
    setProfiles(savedProfiles);
    
    // Auto-load default profile if available and current details are empty
    const defaultProfile = shopProfileStorage.getDefaultProfile();
    if (defaultProfile && !currentShopDetails.name && !currentShopDetails.address) {
      onLoadProfile({
        name: defaultProfile.name,
        address: defaultProfile.address,
        gstin: defaultProfile.gstin
      });
    }
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) return;
    
    const newProfile = shopProfileStorage.saveProfile({
      name: currentShopDetails.name || profileName,
      address: currentShopDetails.address,
      gstin: currentShopDetails.gstin,
      isDefault: profiles.length === 0 // Make first profile default
    });
    
    setProfiles([...profiles, newProfile]);
    setProfileName('');
    setIsDialogOpen(false);
    onSaveSuccess?.();
  };

  const handleLoadProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      onLoadProfile({
        name: profile.name,
        address: profile.address,
        gstin: profile.gstin
      });
      setSelectedProfileId('');
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    shopProfileStorage.deleteProfile(profileId);
    setProfiles(profiles.filter(p => p.id !== profileId));
  };

  const handleSetDefault = (profileId: string) => {
    shopProfileStorage.setDefaultProfile(profileId);
    loadProfiles();
  };

  const canSave = currentShopDetails.name.trim() && currentShopDetails.address.trim();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
      {/* Load Profile Dropdown */}
      {profiles.length > 0 && (
        <Select value={selectedProfileId} onValueChange={handleLoadProfile}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Load saved shop" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{profile.name}</span>
                  {profile.isDefault && <Star className="w-3 h-3 text-yellow-500 ml-2 flex-shrink-0" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex gap-2">
        {/* Save Profile Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!canSave}
              className="border-green-200 text-green-600 hover:bg-green-50 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-1" />
              <span className="hidden xs:inline">Save Shop</span>
              <span className="xs:hidden">Save</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Shop Profile</DialogTitle>
              <DialogDescription>
                Save your shop details as a profile to quickly reuse them for future invoices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profileName">Profile Name</Label>
                <Input
                  id="profileName"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder={currentShopDetails.name || "Enter profile name"}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Shop:</strong> {currentShopDetails.name}</p>
                <p><strong>Address:</strong> {currentShopDetails.address}</p>
                {currentShopDetails.gstin && <p><strong>GSTIN:</strong> {currentShopDetails.gstin}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSaveProfile} disabled={!profileName.trim()} className="flex-1">
                  <Bookmark className="w-4 h-4 mr-1" />
                  Save Profile
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Profiles */}
        {profiles.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
                <span className="hidden xs:inline">Manage ({profiles.length})</span>
                <span className="xs:hidden">Manage</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Shop Profiles</DialogTitle>
                <DialogDescription>
                  View, set default, or delete your saved shop profiles.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{profile.name}</p>
                        {profile.isDefault && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{profile.address}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!profile.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(profile.id)}
                          title="Set as default"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}