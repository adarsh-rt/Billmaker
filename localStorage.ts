// Local storage utilities for shop details
export interface SavedShopProfile {
  id: string;
  name: string;
  address: string;
  gstin: string;
  createdAt: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'billbana_shop_profiles';
const DEFAULT_PROFILE_KEY = 'billbana_default_profile';

export const shopProfileStorage = {
  // Get all saved shop profiles
  getProfiles(): SavedShopProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Save a new shop profile
  saveProfile(profile: Omit<SavedShopProfile, 'id' | 'createdAt'>): SavedShopProfile {
    const profiles = this.getProfiles();
    const newProfile: SavedShopProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // If this is set as default, remove default from others
    if (newProfile.isDefault) {
      profiles.forEach(p => p.isDefault = false);
      localStorage.setItem(DEFAULT_PROFILE_KEY, newProfile.id);
    }

    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return newProfile;
  },

  // Update existing profile
  updateProfile(id: string, updates: Partial<SavedShopProfile>): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...updates };
      
      if (updates.isDefault) {
        profiles.forEach((p, i) => {
          if (i !== index) p.isDefault = false;
        });
        localStorage.setItem(DEFAULT_PROFILE_KEY, id);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  },

  // Delete a profile
  deleteProfile(id: string): void {
    const profiles = this.getProfiles().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    
    // If deleted profile was default, clear default
    const defaultId = localStorage.getItem(DEFAULT_PROFILE_KEY);
    if (defaultId === id) {
      localStorage.removeItem(DEFAULT_PROFILE_KEY);
    }
  },

  // Get default profile
  getDefaultProfile(): SavedShopProfile | null {
    const defaultId = localStorage.getItem(DEFAULT_PROFILE_KEY);
    if (!defaultId) return null;
    
    const profiles = this.getProfiles();
    return profiles.find(p => p.id === defaultId) || null;
  },

  // Set profile as default
  setDefaultProfile(id: string): void {
    const profiles = this.getProfiles();
    profiles.forEach(p => p.isDefault = (p.id === id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem(DEFAULT_PROFILE_KEY, id);
  }
};