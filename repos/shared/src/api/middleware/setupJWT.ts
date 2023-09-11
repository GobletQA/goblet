import { expressjwt as jwt } from 'express-jwt'
import { Express } from 'express'

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
      .unless({path: bypassRoutes})
    )
}
