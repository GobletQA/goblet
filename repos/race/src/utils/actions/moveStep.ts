import type { TRaceStepParent } from '@GBR/types'

import { missing } from '@GBR/utils/logging'
const prefix = `[Move Step Pos]`

export const moveStep = <T extends TRaceStepParent>(
  parent:T,
  oldIdx:number,
  newIdx:number,
) => {
  const step = parent.steps[oldIdx]
  if(!step) return missing(`Step. Failed to update step position.`, prefix, parent)

  const steps = [...parent.steps]
  steps.splice(oldIdx, 1)
  steps.splice(newIdx, 0, step)

  return {...parent, steps}
}
