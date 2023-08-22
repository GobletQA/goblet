/**
 * TODO: Migrate this to use the parkin method once the new version is published with this code
 */

import type { TRaceFeature } from "@gobletqa/race/types"
import { get } from "@keg-hub/jsutils/get"
import { EAstObject } from "@ltipton/parkin"

export type TFindFromId = {
  id:string
  feature:TRaceFeature
}

const parentTypes = [
  EAstObject.rule,
  EAstObject.scenario,
  EAstObject.background,
]

const stepTypes = [
  EAstObject.given,
  EAstObject.when,
  EAstObject.then,
  EAstObject.and,
  EAstObject.but,
]

/**
 * Finds an item in a features from the items uuid ( id )
 */
export const findInFeature = (props:TFindFromId) => {
  const { id, feature } = props
  if(!id) return

  const loc = id.split(`.`).reduce((acc, part) => {
    if(part.startsWith(EAstObject.feature)) return acc

    const child = parentTypes.includes(part as EAstObject)
      ? part === EAstObject.scenario
        ? EAstObject.scenarios
        : part === EAstObject.rule
          ? EAstObject.rules
          : EAstObject.background
      : stepTypes.includes(part as EAstObject)
        ? EAstObject.steps
        : part

    child && acc.push(child)

    return acc
  }, [] as string[])

  const item = get(feature, loc)

  return item.uuid === id && item
}
