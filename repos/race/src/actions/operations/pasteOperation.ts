import {
  TRaceAst,
  TRaceStep,
  TRaceGran,
  EOperations,
  TRaceFeature,
  TRaceScenario,
  TRaceStepParent,
  TRaceBackground,
  TRaceScenarioParent,
} from "@GBR/types"

import { dispatchOp } from "./dispatchOp"
import { buildStep } from '@GBR/utils/actions/buildStep'
import { getFeature } from '@GBR/utils/features/getFeature'
import { logNotFound } from "@gobletqa/race/utils/logging/logNotFound"
import { updateScenario } from "@GBR/actions/scenario/updateScenario"
import { getStepMeta } from "@gobletqa/race/utils/actions/getStepMeta"
import { updateBackground } from "@GBR/actions/background/updateBackground"

const prefix = `[Paste Operation]`

export type TPasteOp = {
  gran?:TRaceGran
  parent:TRaceAst
  child?:TRaceAst
  feature?:TRaceFeature
}

export type TPasteStep = {
  step:TRaceStep
  gran:TRaceGran
  parent:TRaceStepParent
  feature:TRaceFeature
}


const cleanUpAfterPaste = () => {
  return dispatchOp({
    data: undefined,
    type: EOperations.paste
  })
}
 
const pasteStep = (props:TPasteStep) => {
  const {
    gran,
    parent,
    feature,
  } = props

  const stepMeta = getStepMeta(parent, props.step)
  const added = buildStep<TRaceStepParent>(
    feature,
    parent,
    {...props.step, ...stepMeta},
    stepMeta.index
  )

  if(!added) return

  const { steps } = added
  const featureOpts = { skipAudit: false }

  ;(parent as TRaceBackground).background
    ? updateBackground({
        feature,
        featureOpts,
        parentId: gran.uuid,
        background: {...parent, steps} as TRaceBackground
      })
    : updateScenario({
        feature,
        featureOpts,
        scenarioId: parent.uuid,
        parent: gran as TRaceScenarioParent,
        update: {...parent, steps} as TRaceScenario,
      })

  cleanUpAfterPaste()
}

export const pasteOperation = async (props:TPasteOp) => {
  
  const {
    gran,
    parent,
    child,
  } = props
  
  if(!child) return console.log(`Could not paste item. Item to paste could not be found`)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  if((child as TRaceStep).step)
    return pasteStep({
      feature,
      gran: gran || feature,
      step: child as TRaceStep,
      parent: parent as TRaceStepParent,
    })

  console.log(`Copy and paste for ${child.type} is not yet implemented!`)
}

