
import type { TTokenUser, TSocketTokenValid } from '@GSC/types'

import jwt from 'jsonwebtoken'
import { Logger } from '@GSC/utils/logger'
import { screencastConfig } from '@GSC/Configs/screencast.config'

export const validateToken = (inputToken:string) => {
  const secret = screencastConfig?.server?.jwt?.secret
  const data = jwt.verify(inputToken, secret) as TSocketTokenValid

  const {
    token,
    status,
    userId,
    username,
    provider,
    subdomain,
  } = data

  if(!token || !username || !userId || !subdomain){
    const msg = `Invalid Auth token data. Please log in again`
    Logger.error(msg)
    throw new Error(msg)
  }

  return {
    token,
    status,
    userId,
    username,
    provider,
    subdomain,
  } as TTokenUser

}