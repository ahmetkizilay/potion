import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

const APP_NAME = 'testApp';
const TEST_CONFIG = {};

describe('UserService', () => {
  let service: UserService;
  beforeEach(() => {
    const authInstance = jasmine.createSpyObj('Auth', ['login']);
    TestBed.configureTestingModule({
      providers: [UserService,
        provideFirebaseApp(() => initializeApp(TEST_CONFIG, APP_NAME)),
        provideAuth(() => authInstance)
      ] 
    });
  });

  it ('is created', () => {
    service = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });

  it('logs in with Firebase Auth', async () => {
    service = TestBed.inject(UserService);
    await service.login("email", "password");
  });
});