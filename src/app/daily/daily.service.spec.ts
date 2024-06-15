import { TestBed } from '@angular/core/testing';
import { FirebaseApp, getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Firestore, connectFirestoreEmulator, disableNetwork, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth, connectAuthEmulator, Auth, createUserWithEmailAndPassword, User, deleteUser, signOut, signInWithEmailAndPassword } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { Daily, DailyService } from './daily.service';
import { UserService } from '../user/user.service';
import { filter, firstValueFrom } from 'rxjs';

describe('DailyService', () => {
  let app: FirebaseApp;
  let firestore: Firestore;
  let auth: Auth
  let providedFirestore: Firestore;
  let appName: string;
  let currentUser: User|null;

  beforeEach(() => {
    appName = `firestore-tests-${Date.now()}`;
    TestBed.configureTestingModule({
      providers: [
        DailyService,
        UserService,
        provideFirebaseApp(() => initializeApp(environment.firebase.config, appName)),
        provideFirestore(() => {
          providedFirestore = getFirestore(getApp(appName));
          connectFirestoreEmulator(providedFirestore, 'localhost', 8080);
          return providedFirestore;
        }),
        provideAuth(() => {
          const auth = getAuth(getApp(appName));
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          return auth;
        }),
      ],
    });
    app = TestBed.inject(FirebaseApp);
    firestore = TestBed.inject(Firestore);
    auth = TestBed.inject(Auth);
    currentUser = null;
  });

  afterEach(async () => {
    if (currentUser != null) {
      await deleteUser(currentUser);
    }
    await disableNetwork(firestore);
  });

  it('creates Daily Service instance', () => {
    const service = TestBed.inject(DailyService);
    expect(service).toBeTruthy();
  });

  it('saves daily', async () => {
    const email = `u-${Date.now()}@test.com`;
    const password = 'password';
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;

    const userService = TestBed.inject(UserService);
    // Wait for userService to emit the user
    await firstValueFrom(userService.user$.pipe(filter(u => u !== null)));

    const service = TestBed.inject(DailyService);

    const daily: Daily = { text: 'text', title: 'title' };

    const result = await service.save(daily);
    expect(result).toBe(true);
  });

  it('fails to save daily when not authorized', async () => {
    await signOut(auth);

    const service = TestBed.inject(DailyService);
    service.waitTimeForUser = 0;

    const daily: Daily = { text: 'text', title: 'title' };
    await expectAsync(service.save(daily)).toBeRejected();
  });
});
