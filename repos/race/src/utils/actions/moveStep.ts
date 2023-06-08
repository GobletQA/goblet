import type { TRaceStepParent } from '@GBR/types'

import { missing } from '@GBR/utils/logging'
import { EDndPos } from '@gobletqa/components'

const prefix = `[Move Step Pos]`

export const moveStep = <T extends TRaceStepParent>(
  parent:T,
  oldIdx:number,
  newIdx:number,
  pos:EDndPos
) => {
  const step = parent.steps[oldIdx]
  if(!step) return missing(`Step. Failed to update step position.`, prefix, parent)

  const steps = [...parent.steps]
  steps.splice(oldIdx, 1)

  const idx = (pos === EDndPos.before || oldIdx < newIdx)
    ? newIdx
    : newIdx + 1

  steps.splice(idx, 0, {
    ...step,
    // Update the steps index to match the current index + amount of items moved
    index: step.index + (newIdx - oldIdx)
  })

  return {...parent, steps}
}
