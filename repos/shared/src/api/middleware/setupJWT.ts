import type { Express, Request } from 'express'

import { expressjwt as jwt } from 'express-jwt'
import { isBypassRoute } from '@GSH/utils/isBypassRoute'

export const setupJWT = (app:Express, bypassRoutes:(string|RegExp)[]) => {
  const config = app.locals.config.server
  const { secret, algorithms, credentialsRequired } = config.jwt

  // Does not seem to be parsing the JWT token properly
  app.locals.config.server.auth &&
    app.use(
      jwt({
        secret,
        algorithms,
        credentialsRequired
      })
      .unless((req:Request) => isBypassRoute(req.originalUrl, bypassRoutes))
    )
}
