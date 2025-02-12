
export const getFirebaseCfg = () => {
  const {
    FIRE_BASE_KEY,
    FIRE_BASE_APP_ID,
    FIRE_BASE_PROJECT_ID,
    FIRE_BASE_AUTH_DOMAIN,
    FIRE_BASE_STORAGE_BUCKET,
    FIRE_BASE_PERSISTENCE=`local`,
    FIRE_BASE_MESSAGING_SENDER_ID,
    FIRE_BASE_MEASURMENT_ID,
  } = process.env

  return FIRE_BASE_KEY
    ? {
        version: `8.7.1`,
        credentials: {
          apiKey: FIRE_BASE_KEY,
          appId: FIRE_BASE_APP_ID,
          projectId: FIRE_BASE_PROJECT_ID,
          authDomain: FIRE_BASE_AUTH_DOMAIN,
          measurementId: FIRE_BASE_MEASURMENT_ID,
          storageBucket: FIRE_BASE_STORAGE_BUCKET,
          messagingSenderId: FIRE_BASE_MESSAGING_SENDER_ID,
        },
        ui: {
          version: `4.8.0`,
          // Popup sign in flow rather than redirect flow.
          signInFlow: 'popup',
          // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
          signInSuccessUrl: '/',
          // signInSuccessUrl: '/admin',
          signInOptions: [
            {
              name: `GithubAuthProvider`,
              scopes: ['repo'],
            },
          ],
        },
        //See here for more options
        // * https://github.com/benwinding/react-admin-firebase#options
        firestore: {
          logging: false,
          persistence: FIRE_BASE_PERSISTENCE,
          renameMetaFields: {
            created_at: 'createdAt',
            created_by: 'createdBy',
            updated_at: 'updatedAt',
            updated_by: 'updatedBy',
          },
          associateUsersById: true,
          lazyLoading: {
            enabled: false,
          },
          firestoreCostsLogger: {
            enabled: false,
          },
        },
      }
    : {}
}



