import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import * as Firestore from 'firebase-admin/firestore';

admin.initializeApp();
const db = admin.firestore();

// Create a user doc in Firestore in the users collection
export const createUserDoc =
  functions.auth.user().beforeCreate(async (user) => {
    logger.info('Creating user doc for user: ', user.uid);
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: Firestore.FieldValue.serverTimestamp(),
    });
    return;
  });


