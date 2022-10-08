import type { Express } from 'express'
import type { TExpApp, TKubeConfig } from '@GKD/Types'
import { Kubectl } from '@GKD/Kubectl'


export const setupKubectl = (app?:Express|TExpApp) => {
  const kubectl = app?.locals?.config.kubectl as TKubeConfig
  app.locals.kubectl = app?.locals?.kubectl || new Kubectl(kubectl)
}

