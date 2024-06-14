export const environment = {
  name: 'ci',
  production: false,
  firebase: {
    config: {
      "projectId": "potion-bce28",
      "appId": "1:91139147310:web:407b590998cdd83dbf01bf",
    },
    emulators: {
      auth: true,
      firestore: true,
    },
    appCheckDebugToken: '__FIREBASE_APP_CHECK_CI_TOKEN__'
  }
};
