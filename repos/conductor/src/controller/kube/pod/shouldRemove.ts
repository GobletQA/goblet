import type { TPod } from '@GCD/types'
import type { TContainerMap } from '@gobletqa/shared/types'

import { Logger } from '@GCD/utils/logger'

export const shouldRemove = (
  pod:TPod,
  mapped:TContainerMap,
  annotations:Record<string, string>,
) => {
  if(!annotations.userHash){
    Logger.warn(`Found pod with correct image, but missing user-hash`, pod)
    Logger.info(`Force removing pod ${mapped.name}`)
    return true
  }

  if(!annotations.ports){
    Logger.warn(`Found pod with missing ports`, pod)
    Logger.info(`Force removing pod ${mapped.name}`)
    return true
  }

  if(mapped.state === `Succeeded`){
    Logger.info(`Found pod with "Succeeded" state, removing...`)
    return true
  }

  return false
}