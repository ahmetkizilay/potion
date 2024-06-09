import { readFileSync } from 'fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { addDoc, getDoc, setDoc, collection, setLogLevel, doc } from 'firebase/firestore';

async function expectPermissionDenied(operation: Promise<any>) {
  const err = await assertFails(operation);
  expect(err.code).toBe('permission-denied' || 'PERMISSION_DENIED');
}

let testEnv: RulesTestEnvironment;

describe('Firestore rules', () => {
  setLogLevel('error');
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'my-test-project',
      firestore: {
        rules: readFileSync('./firestore/firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      }
    });
  });

  beforeEach(async() => {
    await testEnv.clearFirestore();
  })

  describe('users collection', () => {
    it ('reject write if not authenticated', async() => {
      let unauthedDb = testEnv.unauthenticatedContext().firestore();
      const docRef = doc(unauthedDb, 'users', 'user');
      await expectPermissionDenied(setDoc(docRef, { }));
    });

    it('reject write if authenticated with the wrong user', async () => {
      let authedDb = testEnv.authenticatedContext('currentUser').firestore();
      const docRef = doc(authedDb, 'users', 'anotherUser');
      await expectPermissionDenied(setDoc(docRef, { }));
    });

    it('allow write if authenticated with the correct user', async () => {
      let authedDb = testEnv.authenticatedContext('currentUser').firestore();
      const docRef = doc(authedDb, 'users', 'currentUser');
      await assertSucceeds(setDoc(docRef, { }));
    });

    it('reject read if not authenticated', async () => {
      let unauthedDb = testEnv.unauthenticatedContext().firestore();
      const docRef = doc(unauthedDb, 'users', 'user');
      await expectPermissionDenied(getDoc(docRef));
    });

    it('reject read if authenticated for the wrong user', async () => {
      let authedDb = testEnv.authenticatedContext('currentUser').firestore();
      const docRef = doc(authedDb, 'users', 'anotherUser');
      await expectPermissionDenied(getDoc(docRef));
    });

    it('allow read if authenticated for the correct user', async () => {
      let authedDb = testEnv.authenticatedContext('currentUser').firestore();
      const docRef = doc(authedDb, 'users', 'currentUser');
      await assertSucceeds(getDoc(docRef));
    });
  })

  describe('dailies collection', () => {
    it('reject write if unauthenticated', async () => {
      let unauthedDb = testEnv.unauthenticatedContext().firestore();
      const dailiesRef = collection(unauthedDb, 'dailies');
      await expectPermissionDenied(addDoc(dailiesRef, { text: 'hello' }));
    });

    it('allow write if authenticated', async () => {
      let authedDb = testEnv.authenticatedContext('user').firestore();
      const dailiesRef = collection(authedDb, 'dailies');
      await assertSucceeds(addDoc(dailiesRef, { text: 'hello' }));
    });
  });



});
