import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { auth, googleProvider } from "../lib/firebase";

const AUTH_STORAGE_KEY = "smart-travel-user";

const mapFirebaseUser = (firebaseUser) => ({
  uid: firebaseUser.uid,
  name: firebaseUser.displayName || "Traveler",
  email: firebaseUser.email || "",
  photoURL: firebaseUser.photoURL || "",
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Keep auth state synced with Firebase on refresh/login/logout.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const normalizedUser = mapFirebaseUser(firebaseUser);
        setUser(normalizedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
      } else {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const normalizedUser = mapFirebaseUser(result.user);
    setUser(normalizedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
    return normalizedUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      loginWithGoogle,
      logout,
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
