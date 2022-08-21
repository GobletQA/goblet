
import type { Express } from 'express'
import subdomain from 'express-subdomain'
import { getApp } from '@gobletqa/shared/express/app'
import { AppRouter, AsyncRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets both app routes
 * Adds the main AppRouter on a subdomain
 * Because that's where the proxy will be applied
 */
export const setupRouters = (app?:Express) => {
  app = app || getApp() as Express
  const conductor = app.locals.conductor
  const subdomains = [`*`, `${conductor.config.subdomain || ''}`].filter(Boolean).join('.')

  AsyncRouter.use(subdomain(subdomains, AppRouter))

  app.use(AsyncRouter)
}