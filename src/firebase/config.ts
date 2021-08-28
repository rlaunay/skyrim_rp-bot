import * as firebaseAdmin from 'firebase-admin';
import { projectId, privateKey, clientEmail } from './../config/env';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId,
    clientEmail,
    privateKey
  })
});

export const db = firebaseAdmin.firestore();
export const admin = firebaseAdmin;