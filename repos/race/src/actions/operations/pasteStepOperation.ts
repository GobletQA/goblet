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
import { EDndPos } from '@gobletqa/components'
import { buildStep } from '@GBR/utils/actions/buildStep'
import {removeScenarioStep} from "../scenario/removeScenarioStep"
import { updateScenario } from "@GBR/actions/scenario/updateScenario"
import { getStepMeta } from "@gobletqa/race/utils/actions/getStepMeta"
import {removeBackgroundStep} from "../background/removeBackgroundStep"
import { updateBackground } from "@GBR/actions/background/updateBackground"

export type TPasteOp = {
  pos?:EDndPos
  index?:number
  gran?:TRaceGran
  parent:TRaceAst
  child?:TRaceAst
  from?:EOperations
  feature?:TRaceFeature
}

export type TPasteStep = {
  pos?:EDndPos
  index?:number
  step:TRaceStep
  gran:TRaceGran
  from?:EOperations
  feature:TRaceFeature
  parent:TRaceStepParent
}

const cleanUpAfterPaste = async (props:TPasteStep) => {
  dispatchOp({
    data: undefined,
    type: EOperations.paste
  })
}

export const pasteStepOperation = async (props:TPasteStep) => {
  const {
    pos,
    gran,
    index,
    parent,
    feature,
  } = props

  const { insert, step:stepMeta } = getStepMeta(parent, props.step, pos, index)

  const added = await buildStep<TRaceStepParent>(
    feature,
    parent,
    {...props.step, ...stepMeta},
    insert
  )

  if(!added) return

  const { steps } = added
  const featureOpts = { skipAudit: false }

  ;(parent as TRaceBackground).background
    ? await updateBackground({
        feature,
        featureOpts,
        parentId: gran.uuid,
        background: {...parent, steps} as TRaceBackground
      })
    : await updateScenario({
        feature,
        featureOpts,
        scenarioId: parent.uuid,
        parent: gran as TRaceScenarioParent,
        update: {...parent, steps} as TRaceScenario,
      })

  return await cleanUpAfterPaste(props)
}

