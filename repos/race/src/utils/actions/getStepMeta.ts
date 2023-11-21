import type { TRaceStep, TRaceStepParent } from "@GBR/types"

import {EDndPos} from "@gobletqa/components"
import {exists, uuid} from "@keg-hub/jsutils"


const getStepIndex = (
  parent:TRaceStepParent,
  pos?:EDndPos,
  index?:number
) => {
  return exists<number>(index)
    ? pos === EDndPos.after ? index : index - 1
    // Get the parents index and add that
    // Plus the indexes for existing steps
    // Finally add 1 for the new steps index
    : (parent?.index || 0) + (parent?.steps?.length || 0) + 1
}

const getInsertIndex = (
  parent:TRaceStepParent,
  idx:number
) => {
  const idxDiff = idx - parent.index
  return idxDiff >= 0 ? idxDiff : 0
}

export const getStepMeta = (
  parent:TRaceStepParent,
  step:TRaceStep,
  pos?:EDndPos,
  index?:number
) => {
  const idx = getStepIndex(parent, pos, index)
  const insert = getInsertIndex(parent, idx)
  // Ensure the index is always greater than the parents index
  const sIdx = idx <= parent.index ? parent.index + 1 : idx

  return {
    insert,
    step: {
      index: sIdx,
      uuid: `${parent.uuid}.${step.type}.${sIdx}`,
    }
  }

}
