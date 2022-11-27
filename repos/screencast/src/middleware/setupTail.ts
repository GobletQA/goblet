import type { Express } from 'express'
import { TailLogger } from '@GSC/libs/playwright/tailLogger'

export const setupTail = (app:Express) => {
  app.locals.tailLogger = app.locals.tailLogger
    || new TailLogger(app?.locals?.config?.tail)
}