"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  hasAccess: boolean;
  expiresAt: Date | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  hasAccess: false,
  expiresAt: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    let unsubscribeFirestore: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Escuchar cambios en el documento del usuario
        unsubscribeFirestore = onSnapshot(doc(db, "Users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            let validAccess = !!data.hasAccess;
            let expirationDate = null;

            if (data.expiresAt) {
              expirationDate = new Date(data.expiresAt);
              if (new Date() > expirationDate) {
                validAccess = false; // Trial has expired
              }
            }
            
            setHasAccess(validAccess);
            setExpiresAt(expirationDate);
          } else {
            setHasAccess(false);
            setExpiresAt(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error subscribing to user doc:", error);
          setLoading(false);
        });
      } else {
        setHasAccess(false);
        setExpiresAt(null);
        setLoading(false);
        if (unsubscribeFirestore) unsubscribeFirestore();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, hasAccess, expiresAt }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
