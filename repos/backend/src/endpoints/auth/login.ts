import type { Response } from 'express'
import type { Request as JWTRequest } from 'express-jwt'
import { apiRes } from '@gobletqa/shared/express/apiRes'
import { resError } from '@gobletqa/shared/express/resError'
import { AsyncRouter } from '@gobletqa/shared/express/appRouter'
import { validateRefreshToken } from '@GBE/utils/validateRefreshToken'

/**
 * Validates the required authentication information exists
 */
export const login = async (req:JWTRequest, res:Response) => {
  

}


AsyncRouter.post('/auth/login', login)