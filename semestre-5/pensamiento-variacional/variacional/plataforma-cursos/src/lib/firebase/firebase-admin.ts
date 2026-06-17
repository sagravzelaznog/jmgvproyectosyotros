import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminDb: FirebaseFirestore.Firestore;
let adminAuth: import('firebase-admin/auth').Auth;
let initError: string | null = null;

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
          : undefined,
      }),
    });
  }
  adminDb = getFirestore();
  adminAuth = getAuth();
} catch (error: any) {
  initError = error.message || String(error);
  console.error("Firebase Admin Initialization Error:", error);
}

export { adminDb, adminAuth, initError };
