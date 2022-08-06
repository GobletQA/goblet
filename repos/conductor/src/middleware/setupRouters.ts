
import { Express } from 'express'
import subdomain from 'express-subdomain'
import type { Conductor } from '../conductor'
import { getApp } from '@gobletqa/shared/express/app'
import { buildSubdomains } from '../utils/buildSubdomains'
import { AppRouter, ProxyRouter } from '@gobletqa/conductor/server/routers'

import '@gobletqa/conductor/endpoints'

export const setupRouters = (app?:Express) => {
  app = app || getApp() as Express
  const conductor = app.locals.conductor as Conductor
  app.use(subdomain(`*.${buildSubdomains(conductor?.domain)}`, ProxyRouter))

  app.use(AppRouter)
}