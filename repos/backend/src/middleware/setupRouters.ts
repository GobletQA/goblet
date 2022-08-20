
import type { Express } from 'express'
import subdomain from 'express-subdomain'
import { getApp } from '@gobletqa/shared/express/app'
import { AppRouter, AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets both app routes
 * Adds the main AppRouter on a subdomain
 * Because that's where the proxy will be applied
 */
export const setupRouters = (app?:Express, subdom?:string) => {
  app = app || getApp() as Express
  const { conductor } = app.locals.config
  AsyncRouter.use(subdomain(`*.${conductor.subdomain || subdom}`, AppRouter))

  app.use(AsyncRouter)
}