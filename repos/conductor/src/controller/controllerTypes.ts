import type { Conductor } from '../conductor'
import { TControllerConfig } from '@gobletqa/conductor/types'

import { Kube } from './kube/kube'
import { Docker } from './docker/docker'
import { capitalize } from '@keg-hub/jsutils'

export const controllerTypes = {
  Kube,
  Docker
}

export const getController = (conductor:Conductor, config:TControllerConfig) => {
  const Controller = controllerTypes[capitalize(config?.type)]

  return new Controller(conductor, config)
}