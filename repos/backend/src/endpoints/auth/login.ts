import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'

import { apiRes, resError, AppRouter } from '@gobletqa/shared/api'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const login = async (req:JWTRequest, res:Response) => {
  

}


AppRouter.post('/auth/login', login)