
import type { TSocketTokenData } from '@GSC/types'

import jwt from 'jsonwebtoken'
import { screencastConfig } from '@GSC/Configs/screencast.config'

export const validateToken = (token:string) => {
  const secret = screencastConfig?.server?.jwt?.secret
  const data = jwt.verify(token, secret) as TSocketTokenData
  // Validate the socket token data here
  // Then respond with true if it's valid
  // Otherwise throw an error
  const {  } = data
  
}