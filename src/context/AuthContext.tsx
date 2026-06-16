"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getMyProfile } from "../services/auth.service";


interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: React.Dispatch<any>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadUser =
      async () => {
        try {
          const res =
            await getMyProfile();

          setUser(
            res.data
          );
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () => {
    const context =
      useContext(AuthContext);

    if (!context) {
      throw new Error(
        "AuthContext Missing"
      );
    }

    return context;
  };