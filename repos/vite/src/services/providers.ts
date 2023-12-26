import type { FirebaseOptions } from 'firebase/app'

// TODO: BitBucket providers via OAuth Provider
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from "firebase/analytics"
import { getFirestore } from 'firebase/firestore'
import { set, isArr, isObj, isStr } from '@keg-hub/jsutils'
import {
  getAuth,
  setPersistence,
  GithubAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'

const FBProviders = {
  GithubAuthProvider
}

type TAuthProvider = {
  name:keyof typeof FBProviders
  scopes:string|string[]
}

type TRawConfig<P=any> = {
  serviceAccount:never
  credentials: FirebaseOptions
  ui: {
    version: string,
    signInOptions: P[]
  }
}


/**
 * Configures the auth providers defined in the config object
 * Ensures the providers is setup for allow logging in
 */
const setupAuthProviders = (config:TRawConfig<TAuthProvider>) => {
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

  return config as unknown as TRawConfig<GithubAuthProvider>
}

let rawConfig:TRawConfig
try {
  rawConfig = JSON.parse(process.env.FIRE_BASE_CONFIG || ``)
  if (rawConfig && rawConfig.serviceAccount)
    throw new Error(
      `[FIREBASE ERROR] The firebase service account should not be used on the frontend.`
    )
}
catch (err:any) {
  err?.message
    ? console.log(`[FIREBASE PARSE ERROR]`, err?.message)
    : console.log(`[FIREBASE PARSE ERROR]`, err)
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
export const getUserToken = async (forceRefresh=true, recall=0) => {
  await firebaseAuth.authStateReady()
  return await firebaseAuth?.currentUser?.getIdToken?.(forceRefresh)
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
