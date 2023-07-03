import {
  TRaceAst,
  TRaceStep,
  TRaceGran,
  EOperations,
  TRaceFeature,
  TRaceStepParent,
} from "@GBR/types"

import { EDndPos } from '@gobletqa/components'
import { pasteStepOperation } from "./pasteStepOperation"
import { getFeature } from '@GBR/utils/features/getFeature'
import { logNotFound } from "@gobletqa/race/utils/logging/logNotFound"

const prefix = `[Paste Operation]`

export type TPasteOp = {
  pos?:EDndPos
  index?:number
  gran?:TRaceGran
  parent:TRaceAst
  child?:TRaceAst
  from?:EOperations
  feature?:TRaceFeature
}

export const pasteOperation = async (props:TPasteOp) => {
  const {
    pos,
    gran,
    from,
    index,
    parent,
    child,
  } = props
  
  if(!child) return console.log(`Could not paste item. Item to paste could not be found`)

  const { feature } = await getFeature(props.feature)
  if(!feature) return logNotFound(`feature`, prefix)

  if((child as TRaceStep).step)
    return await pasteStepOperation({
      pos,
      from,
      index,
      feature,
      gran: gran || feature,
      step: child as TRaceStep,
      parent: parent as TRaceStepParent,
    })

  console.log(`Copy and paste for ${child.type} is not yet implemented!`)
}

