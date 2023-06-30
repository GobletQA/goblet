import {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceScenarioParent,
  TRaceStepParent,
  EOperations,
} from "@GBR/types"

import {emptyArr} from '@keg-hub/jsutils'
import { logNotFound } from '@GBR/utils/logging'
import { dispatchOp } from "../operations/dispatchOp"
import { buildStep } from '@GBR/utils/actions/buildStep'
import { updateFeature } from '@GBR/actions/feature/updateFeature'
import { getFeature } from '@gobletqa/race/utils/features/getFeature'
import { getStepMeta } from "@gobletqa/race/utils/actions/getStepMeta"
import { findSimpleScenario } from '@GBR/utils/find/findSimpleScenario'

const prefix = `[Paste Simple Mode]`

export type TPasteSimpleModeStep = {
  step: TRaceStep
  persist?:boolean
  feature?:TRaceFeature
  scenario: TRaceScenario
  parent: TRaceScenarioParent
}

const cleanUpAfterPaste = () => {
  return dispatchOp({
    data: undefined,
    type: EOperations.paste
  })
}
 

export const pasteSimpleModeStep = async (props:TPasteSimpleModeStep) => {

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  const { scenario:scn, index } = findSimpleScenario({...props, feature})

  const stepMeta = getStepMeta(scn, props.step)
  const added = buildStep<TRaceStepParent>(
    feature,
    scn,
    {...props.step, ...stepMeta },
    stepMeta.index
  )

  if(!added) return

  const { steps, step } = added
  const scenarios = [...(feature.scenarios || emptyArr)]
  scenarios[index] = {...scn, steps}

  const featureOpts = {
    mergeAudit: true,
    skipAudit: false,
    expand: step.uuid,
  }

  const update = {...feature, scenarios}

  props.persist !== false && updateFeature(update, featureOpts)

  cleanUpAfterPaste()

  return update
}
