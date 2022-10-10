import type { Controller } from '../controller'
import type { TContainerMap, } from '../types'

import { generateRoutes } from './generators'
import { ConductorUserHashLabel } from '../constants'


const routesFromContainer = (
  controller:Controller,
  container:TContainerMap,
) => {
  const userHash = container.labels[ConductorUserHashLabel]
  if(!userHash) return

  controller.routes[userHash] = generateRoutes(
    container.ports,
    controller.conductor,
    userHash,
    {
      id: container.id,
      name: container.name,
      state: container.state,
    }
  )

}

export const hydrateRoutes = (
  controller:Controller,
  containers:Record<string, TContainerMap>
) => {
  return Promise.all(
    Object.entries(containers)
      .map(([key, container]) => routesFromContainer(controller, container))
  )
}
