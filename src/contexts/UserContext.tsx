import { createContext, useContext, ReactNode } from 'react';
import { UserProfile } from '../types/user.types';

interface UserContextType {
  userProfile: UserProfile;
  isManager: boolean;
  isTechnician: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  children,
  userProfile
}: {
  children: ReactNode;
  userProfile: UserProfile;
}) {
  const value = {
    userProfile,
    isManager: userProfile.role === 'manager',
    isTechnician: userProfile.role === 'technician'
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
