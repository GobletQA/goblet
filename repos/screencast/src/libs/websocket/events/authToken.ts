import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

export const authToken = (app:Express) => {
  return ({ data, socket }:TSocketEvtCBProps) => {}
}

