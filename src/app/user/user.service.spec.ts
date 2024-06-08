import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideAuth, getAuth, connectAuthEmulator, Auth, User, user as observeUser, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { initializeApp, getApp, provideFirebaseApp, FirebaseApp } from '@angular/fire/app';

import { environment } from '../../environments/environment';
import { deleteUser, signOut } from '@firebase/auth';
import { filter, firstValueFrom, take } from 'rxjs';

const APP_NAME = 'testApp';
const TEST_CONFIG = {};

describe('UserService', () => {
  let app: FirebaseApp;
  let auth: Auth;
  let appName: string;
  let currentUser: User | undefined;

  beforeEach(() => {
    appName = `auth-tests-${Date.now()}`;
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideFirebaseApp(() => initializeApp(environment.firebase.config, appName)),
        provideAuth(() => {
          const auth = getAuth(getApp(appName));
          if (environment.firebase.emulators.auth) {
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          }
          return auth;
        }),
      ],
    });
    app = TestBed.inject(FirebaseApp);
    auth = TestBed.inject(Auth);
  });

  afterEach(async () => {
    if (currentUser) {
      await deleteUser(currentUser);
    }
  });

  it('logs in with Firebase Auth', async () => {
    const email = `u-${Date.now()}@test.com`;
    const password = 'password';
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    expect(userCredential.user).toBeTruthy();

    // Store the user reference and signout.
    currentUser = userCredential.user;
    await signOut(auth);

    let service = TestBed.inject(UserService);
    const res = await service.login(email, password);
    expect(res).toBe(true);
    // Wiat for a truthy value.
    const signedInPing = await firstValueFrom(service.isSignedIn$.pipe(filter(val => !!val)));
    expect(signedInPing).toBeTrue();
  });

  it ('logs out with Firebase Auth', async () => {
    const email = `u-${Date.now()}@test.com`;
    const password = 'password';
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    expect(userCredential.user).toBeTruthy();

    // Store the user reference to clean up later.
    currentUser = userCredential.user;

    let service = TestBed.inject(UserService);
    const signedInPing = await firstValueFrom(service.isSignedIn$);
    expect(signedInPing).toBeTrue();

    await service.logout();
    // Wait for a falsy value.
    const signedOutPing = await firstValueFrom(service.isSignedIn$.pipe(filter(val => !val)));
    expect(signedOutPing).toBeFalse();
  });
});
