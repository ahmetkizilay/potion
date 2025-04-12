import * as logger from 'firebase-functions/logger'
import * as admin from 'firebase-admin';
import * as Firestore from 'firebase-admin/firestore';
import { beforeUserCreated} from 'firebase-functions/identity'

admin.initializeApp();
const db = admin.firestore();

// Create a user doc in Firestore in the users collection
export const createUserDoc =
  beforeUserCreated(async (event) => {
    logger.info('Received beforeUserCreated event: ', event.eventId)
    if (!event.data) {
      throw new Error('No event data');
    }
    const userEmail = event.data.email;
    if (!userEmail) {
      throw new Error('No user email');
    }
    logger.info('Creating user doc for user: ', event.eventId)

    await db.collection('users').doc(event.eventId).set({
      email: userEmail,
      createdAt: Firestore.FieldValue.serverTimestamp(),
    });
    return;
  });