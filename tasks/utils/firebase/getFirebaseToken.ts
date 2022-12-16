import type { TTaskParams, TContainerEnvs } from '../../types'

import fs from 'fs'

/**
 * Finds the firebase token from the passed in params or as an ENV
 */
export const getFirebaseToken = async (params:TTaskParams, envs:TContainerEnvs) => {
  const token = params.token || process.env.FIREBASE_TOKEN || envs.FIREBASE_TOKEN
  if(token) return token.trim()

  const tokenFile = params.tokenFile || process.env.FIREBASE_TOKEN_FILE || envs.FIREBASE_TOKEN_FILE
  if(!tokenFile) throw new Error(`Missing firebase token env or file path, can not deploy`)

  return fs.readFileSync(tokenFile).toString().trim()
}
