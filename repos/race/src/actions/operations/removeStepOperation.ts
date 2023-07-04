import {
  TRaceStep,
  TRaceGran,
  TRaceFeature,
  TRaceStepParent,
} from "@GBR/types"


import {removeScenarioStep} from "../scenario/removeScenarioStep"
import {removeBackgroundStep} from "../background/removeBackgroundStep"

export type TRemoveStep = {
  item:TRaceStep
  gran?:TRaceGran
  feature?:TRaceFeature
  parent?:TRaceStepParent
}

export const removeStepOperation = async (props:TRemoveStep) => {
  const {
    gran,
    item,
    parent,
    feature,
  } = props

  if(!parent) return

  return (`scenario` in parent)
    ? await removeScenarioStep({
        feature,
        force: true,
        granParent: gran,
        stepId: item.uuid,
        stepParentId: parent.uuid,
      })
    : await removeBackgroundStep({
        feature,
        force: true,
        granParent: gran,
        stepId: item.uuid,
        stepParentId: parent.uuid,
      })
}
