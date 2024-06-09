/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as logger from "firebase-functions/logger";
import * as admin from 'firebase-admin';
import * as Firestore from "firebase-admin/firestore";

admin.initializeApp();
const db = admin.firestore();

// Create a user doc in Firestore in the users collection
export const createUserDoc = functions.auth.user().beforeCreate(async (user) => {
  logger.info("Creating user doc for user: ", user.uid);
  await db.collection('users').doc(user.uid).set({
    email: user.email,
    createdAt: Firestore.FieldValue.serverTimestamp(),
  });
  return;
});


