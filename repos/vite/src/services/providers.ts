// @ts-nocheck
// TODO: Implement Gitlab / BitBucket providers via OAuth Provider
// import { GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics"
import { getFirestore } from 'firebase/firestore'
import { set, isArr, isObj } from '@keg-hub/jsutils'
import {
  getAuth,
  setPersistence,
  GithubAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'

const FBProviders = {
  GithubAuthProvider
}

/**
 * Configures the auth providers defined in the config object
 * Ensures the providers is setup for allow logging in
 * @param {Object} config - Firebase config
 *
 * @returns {Object} - config with the auth providers setup for UI sign in
 */
const setupAuthProviders = (config:any) => {
  if (!config) return config

  const { version, signInOptions, ...uiConfig } = config.ui

  const authWithId = !isArr(signInOptions)
    ? signInOptions
    : signInOptions.map(provider => {
        if (!isObj(provider)) return provider
        
        const ProviderClass = FBProviders[provider.name] 
        if(!ProviderClass) throw new Error(`Missing Auth Provider Class for "${provider.name}"`)

        const instance = new ProviderClass()
        isArr(provider.scopes)
          ? provider.scopes.map(scope => instance.addScope(scope))
          : isStr(provider.scopes) && instance.addScope(provider.scopes)

        return instance
      })

  set(config, 'ui', {
    ...uiConfig,
    signInOptions: authWithId,
  })

  return config
}

let rawConfig
try {
  rawConfig = JSON.parse(process.env.FIRE_BASE_CONFIG)
  if (rawConfig && rawConfig.serviceAccount)
    throw new Error(
      `[FIREBASE ERROR] The firebase service account should not be used on the frontend.`
    )
} catch (err) {
  console.log(`------- FIREBASE PARSE ERROR -------`)
  console.log(err.message)
}

const getConfig = () => rawConfig && setupAuthProviders(rawConfig)


const firebaseConfig = getConfig()
const firebaseApp = firebaseConfig && initializeApp(firebaseConfig.credentials)
const firestore = firebaseApp && getFirestore(firebaseApp)
const firebaseAuth = firebaseApp && getAuth(firebaseApp)
const firebaseAnal = {}
// const firebaseAnal = process.env.NODE_ENV !== `local`
//   ? firebaseApp && getAnalytics(firebaseApp)
//   : {}

// Setup auth persistence
firebaseApp &&
  firebaseAuth &&
  setPersistence(
    firebaseAuth,
    process.env.FIRE_BASE_PERSISTENCE === 'session'
      ? browserSessionPersistence
      : browserLocalPersistence
  )

/**
 * Helper to get the current users token ID
 * @param {boolean} forceRefresh - Force invalidate the token, and generate a new one
 *
 * @return {string} - Current users token
 */
export const getUserToken = async (forceRefresh = true) => {
  return (
    (await firebaseApp) && firebaseAuth.currentUser.getIdToken(forceRefresh)
  )
}

/**
 * Gets provider metadata for firebase modules
 *
 * @return {Object} - Contains all initialized firebase modules
 */
export const getProviderMetadata = () => ({
  app: firebaseApp,
  auth: firebaseAuth,
  anal: firebaseAnal,
  database: firestore,
  config: firebaseConfig,
})
