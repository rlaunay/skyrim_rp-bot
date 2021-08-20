import * as firebaseAdmin from 'firebase-admin';

// TODO mettre les cred en variable ENV
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: '',
    clientEmail: '',
    privateKey: ''
  })
});

export const db = firebaseAdmin.firestore();
export const admin = firebaseAdmin;