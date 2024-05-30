import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({
      "projectId": "potion-bce28",
      "appId": "1:91139147310:web:407b590998cdd83dbf01bf",
      "storageBucket": "potion-bce28.appspot.com",
      "apiKey": "AIzaSyAWqj_zYk5aKnhcAG2n_eoL_7dpJZLnxQY",
      "authDomain": "potion-bce28.firebaseapp.com",
      "messagingSenderId": "91139147310",
      "measurementId": "G-X92K3JKDK1"
    })),
    provideAuth(() => getAuth()),
  ]
};
