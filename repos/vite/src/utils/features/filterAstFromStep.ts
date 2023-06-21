import type {
  TRaceStep,
  TRaceRule,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from "@gobletqa/race"

import { TFeatureAst, EAstObject} from "@ltipton/parkin"
import {emptyArr, get } from "@keg-hub/jsutils"

type TFilerFeature = Omit<TRaceFeature, `path`|`parent`>

export type TFilterAstFromStep = {
  step:TRaceStep
  feature:TRaceFeature
}

const stepKey = [
  EAstObject.step,
  EAstObject.given,
  EAstObject.when,
  EAstObject.then,
  EAstObject.and,
  EAstObject.but,
  EAstObject[`*`],
]

const filterFromParent = (
  parentAst:TFilerFeature|TRaceRule|TRaceScenario|TRaceBackground,
  step:TRaceStep,
  parts:string[]
) => {

  const type = parts.shift() as EAstObject

  if(stepKey.includes(type)){
    ;(parentAst as TRaceScenario).steps = [step]
    return parentAst
  }

  const idx = parts.shift()
  if(!idx) throw new Error(`Invalid index found in step uuid path: ${step.uuid}`)

  const copy = {...parentAst}
  let parent:TRaceRule|TRaceScenario|TRaceBackground|undefined=undefined

  switch(type){
    case EAstObject.scenario:
      parent = {...get<TRaceScenario>(copy, [`scenarios`, idx])}

      if(`rules` in copy) copy.rules = emptyArr
      if(`background` in copy) copy.background = undefined

      if(`scenarios` in copy)
        copy.scenarios = [filterFromParent(parent, step, parts) as TRaceScenario]

      break
    case EAstObject.rule:
      parent = {...get<TRaceRule>(copy, [`rules`, idx])}

      if(`scenarios` in copy) copy.scenarios = emptyArr
      if(`background` in copy) copy.background = undefined

      if(`rules` in copy)
        copy.rules = [filterFromParent(parent, step, parts) as TRaceRule]

      break
    case EAstObject.background:
      if(`rules` in copy) copy.rules = emptyArr
      if(`scenarios` in copy) copy.scenarios = emptyArr

      if(`background` in copy){
        parent = {...(copy.background as TRaceBackground)} as TRaceBackground
        copy.background = filterFromParent(parent, step, parts) as TRaceBackground
      }

      break
  }

  if(!parent) throw new Error(`Could not find parent from type ${type}`)

  return copy
}

export const filterAstFromStep = (props:TFilterAstFromStep) => {
  const {
    step,
    feature
  } = props

  const [__, ...parts] = step.uuid.split(`.`)
  const {
    path,
    tags,
    empty,
    parent,
    reason,
    desire,
    content,
    comments,
    perspective,
    ...rest
  } = feature

  return filterFromParent(
    { content: ``, comments: [], ...rest },
    step,
    parts
  )
}