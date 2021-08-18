import * as firebaseAdmin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccount.json';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount)
});

export const db = firebaseAdmin.firestore();
export const admin = firebaseAdmin;