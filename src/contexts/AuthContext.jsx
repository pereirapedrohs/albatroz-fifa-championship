import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, logout } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => signInWithEmail(email, password);
  const register = async (email, password) => signUpWithEmail(email, password);
  const loginWithGoogle = async () => signInWithGoogle();
  const logoutUser = async () => logout();

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout: logoutUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
