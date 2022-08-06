
import { Express } from 'express'
import subdomain from 'express-subdomain'
import type { Conductor } from '../conductor'
import { getApp } from '@gobletqa/shared/express/app'
import { AppRouter, ProxyRouter } from '@gobletqa/conductor/server/routers'
import '@gobletqa/conductor/endpoints'

export const setupRouters = (app?:Express) => {
  app = app || getApp() as Express
  const conductor = app.locals.conductor as Conductor
  const host = conductor?.config?.server?.host
  const split =  host.split(`.`)

  const subdomains = split.length > 2
    ? split.slice(0, split.length - 2).join('.')
    : `conductor`

  AppRouter.use(subdomain(`*.${subdomains}`, ProxyRouter))
  app.use(AppRouter)
}