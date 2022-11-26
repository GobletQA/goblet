import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { noOpObj } from '@keg-hub/jsutils'

export const repoStatus = (app:Express) => {
  return ({ data = noOpObj, socket, config, Manager, io }:TSocketEvtCBProps) => {}
}
