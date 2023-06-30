import type { TRaceStep, TRaceStepParent } from "@GBR/types"


export const getStepMeta = (
  parent:TRaceStepParent,
  step:TRaceStep
) => {
  // Get the parents index and add that
  // Plus the indexes for existing steps
  // Finally add 1 for the new steps index
  const index = (parent?.index || 0) + (parent?.steps?.length || 0) + 1
  const uuid = `${parent.uuid}.${step.type}.${parent?.steps?.length || 0}`

  return {
    uuid,
    index,
  }

}
