
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthEnabled: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isAuthEnabled: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // We allow the UI to show auth features even if config is missing or auth failed
  const isAuthEnabled = !!auth;

  useEffect(() => {
    if (!auth) {
      console.warn("Auth service is not available. Authentication features will be disabled.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};
