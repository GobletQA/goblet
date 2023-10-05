import type {
  TRaceStep,
  TRaceRule,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from "@gobletqa/race"

import { EAstObject} from "@ltipton/parkin"
import {
  get,
  toNum,
  exists,
  omitKeys,
  emptyArr,
} from "@keg-hub/jsutils"


type TFilterFeature = Omit<TRaceFeature, `path`|`parent`>

export type TFilterAstFromId = {
  id:string
  single?:boolean
  feature:TRaceFeature
}

type TFilterParent = TFilterFeature|TRaceRule|TRaceScenario|TRaceBackground
type TFilterFromParent<T extends TFilterParent> = {
  id:string
  parent:T,
  parts:string[],
  single?:boolean
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

const typeNameMap = {
  [EAstObject.rule]: EAstObject.rules,
  [EAstObject.rules]: EAstObject.rules,
  [EAstObject.scenario]: EAstObject.scenarios,
  [EAstObject.scenarios]: EAstObject.scenarios,
  [EAstObject.background]: EAstObject.background,

  // Map all the `step keys` to `steps` type
  ...(stepKey.reduce((acc, key) => {
    acc[key] = EAstObject.steps
    return acc
  }, {} as Record<string, string>)),
} 

type TFilterItem = TRaceRule|TRaceScenario|TRaceStep

const filterArrItems = <T extends TFilterItem>(
  items:T[],
  item:T,
  single?:boolean
):T[] => {

  if(!item) return []
  if(single || !items?.length) return [item]

  const idx = items.findIndex(it => it.uuid === item.uuid)
  if(!exists(idx))
    throw new Error(`Can not filter feature items, item does in not exist in parent array`)

  return items.slice(idx)
}

const filterFromParent = <T extends TFilterParent>({
  id,
  parts,
  single,
  parent:parentAst,
}:TFilterFromParent<T>):T => {

  const type = parts.shift() as EAstObject
  const idx = parts.shift()

  if(!idx) return parentAst

  if(stepKey.includes(type)){
    const items = (parentAst as TRaceScenario).steps
    const item = items[toNum(idx)]
    if(!item) return { ...parentAst, steps: [] }
    ;(parentAst as TRaceScenario).steps = filterArrItems<TRaceStep>(items, item, single)
    return parentAst
  }

  const copy = {...parentAst}
  const isLast = Boolean(!parts.length)
  let parent:TRaceRule|TRaceScenario|TRaceBackground|undefined=undefined

  // Normalize the type to ensure it's consistent
  const name = typeNameMap[type as keyof typeof typeNameMap] || type

  switch(name){
    case EAstObject.scenarios:
      parent = omitKeys<TRaceScenario>(
        {...get<TRaceScenario>(copy, [EAstObject.scenarios, idx])},
        [`tags`]
      )

      if(EAstObject.rules in copy) copy.rules = emptyArr
      if(EAstObject.background in copy) copy.background = undefined

      if(!(EAstObject.scenarios in copy)) return copy

      if(isLast)
        copy.scenarios = filterArrItems<TRaceScenario>(
          copy.scenarios,
          parent,
          single
        )
      else
        copy.scenarios = [filterFromParent({ parent, id, parts, single })]

      break
    case EAstObject.rules:
      parent = omitKeys<TRaceRule>(
        {...get<TRaceRule>(copy, [EAstObject.rules, idx])},
        [`tags`]
      )

      if(EAstObject.scenarios in copy) copy.scenarios = emptyArr
      if(EAstObject.background in copy) copy.background = undefined

      if(!(EAstObject.rules in copy)) return copy

      if(isLast)
        copy.rules = filterArrItems<TRaceRule>(
          copy?.rules || [],
          parent,
          single
        )
      else
        copy.rules = [filterFromParent({ parent, id, parts, single })]

      break
    case EAstObject.background:
      if(EAstObject.rules in copy) copy.rules = emptyArr
      if(EAstObject.scenarios in copy) copy.scenarios = emptyArr

      if(EAstObject.background in copy){
        parent = omitKeys<TRaceBackground>(
          {...(copy.background as TRaceBackground)},
          [`tags`]
        )

        copy.background = filterFromParent({ parent, id, parts, single })
      }

      break
  }

  if(!parent) throw new Error(`Could not find parent from type ${type}`)

  return copy
}

export const filterAstFromId = (props:TFilterAstFromId) => {
  const {
    id,
    single,
    feature
  } = props

  const [__, ...parts] = id.split(`.`)

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

  return filterFromParent<TFilterFeature>({
    id,
    parts,
    single,
    parent: { content: ``, comments: [], ...rest },
  })

}