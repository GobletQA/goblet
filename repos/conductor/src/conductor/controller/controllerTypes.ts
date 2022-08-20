import type { Conductor } from '../conductor'
import { TControllerConfig } from '@gobletqa/conductor/types'

import { Docker } from './docker/docker'
import { capitalize } from '@keg-hub/jsutils'

export const controllerTypes = {
  Docker
}

export const getController = (conductor:Conductor, config:TControllerConfig) => {
  const Controller = controllerTypes[capitalize(config?.type)]

  return new Controller(conductor, config)
}