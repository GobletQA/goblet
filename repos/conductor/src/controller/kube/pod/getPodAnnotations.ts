import type { TPod } from '@GCD/types'

import { Logger } from '../../../utils/logger'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { PodAnnotations, ConductorUserHashLabel } from '@GCD/constants'

export const getPodAnnotations = (pod:TPod) => {
  const name = pod?.metadata?.annotations?.[PodAnnotations.component]
  const userHash = pod?.metadata?.annotations?.[ConductorUserHashLabel]
  try {
    const ports = userHash
      ? JSON.parse(pod?.metadata?.annotations?.[PodAnnotations.ports])
      : noOpObj

    return { ports, name, userHash }
  }
  catch(err){
    Logger.error(`Pod missing ports annotation.`)
    Logger.info(pod?.metadata?.annotations)
    return { name, userHash }
  }
}