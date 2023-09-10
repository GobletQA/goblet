import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import { apiRes } from '@gobletqa/shared/api/express/apiRes'
import { resError } from '@gobletqa/shared/api/express/resError'
import { AppRouter } from '@gobletqa/shared/api/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const login = async (req:JWTRequest, res:Response) => {
  

}


AppRouter.post('/auth/login', login)