import type { Controller } from '../controller'
import type { TContainerInspect, TContainerMap, } from '../types'

import { generateRoutes } from './generators'
import { CONDUCTOR_USER_HASH_LABEL } from '../constants'


const routesFromContainer = (
  controller:Controller,
  container:TContainerMap,
) => {
  const userHash = container.labels[CONDUCTOR_USER_HASH_LABEL]
  if(!userHash) return


  controller.routes[userHash] = generateRoutes(
    container.ports,
    controller.conductor,
    userHash,
    {
      state: `Running`,
      id: container.id,
      name: container.name,
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
