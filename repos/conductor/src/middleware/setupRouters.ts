
import { Express } from 'express'
import subdomain from 'express-subdomain'
import type { Conductor } from '../conductor'
import { getApp } from '@gobletqa/shared/express/app'
import { buildSubdomains } from '../utils/buildSubdomains'
import { AppRouter, ProxyRouter } from '@gobletqa/conductor/server/routers'

import 'app/endpoints'

export const setupRouters = (app?:Express, subdomain:string) => {
  app = app || getApp() as Express
  AppRouter.use(subdomain(`*.${subdomain}`, ProxyRouter))

  app.use(AppRouter)
}