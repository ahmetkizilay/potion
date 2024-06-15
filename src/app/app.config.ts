import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { ReCaptchaEnterpriseProvider, initializeAppCheck, provideAppCheck } from '@angular/fire/app-check';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebase.config)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.firebase.emulators.auth) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.firebase.emulators.firestore) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore
    }),
    provideAppCheck(() => initializeAppCheck(getApp(), {
      provider: new ReCaptchaEnterpriseProvider(
        environment.firebase.config.recaptchaSiteKey
      ),
      isTokenAutoRefreshEnabled: true,
    })),
  ]
};
