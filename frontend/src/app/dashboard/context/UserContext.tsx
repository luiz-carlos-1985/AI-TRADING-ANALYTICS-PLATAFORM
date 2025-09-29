'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    timezone: string;
    photo: string;
  };
}

interface UserContextType {
  settings: UserSettings;
  updateSetting: (category: string, key: string, value: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      timezone: 'UTC-3',
      photo: ''
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value
      }
    };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  return (
    <UserContext.Provider value={{ settings, updateSetting }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}