import type { Express } from 'express'
import type { Kubectl } from '@GKD/Kubectl'
import type { TKindConfig } from './kind.types'

export type TAppLocals = {
  kubectl: Kubectl
  config: TKindConfig
  [key:string]:any
}

export type TExpApp = Omit<Express, 'locals'> & {
  locals: TAppLocals
}