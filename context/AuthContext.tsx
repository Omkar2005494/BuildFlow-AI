"use client";

import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        loading: false,
        signInWithGoogle: async () => {},
        signInWithEmail: async () => {},
        signUpWithEmail: async () => {},
        logout: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
