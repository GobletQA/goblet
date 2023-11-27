import type { TRaceTagsParent, TRaceTags, TRaceFeature } from '@GBR/types'
import { EBlockLoc } from '@ltipton/parkin'

import { ESectionType } from '@GBR/types'
import { ParkinWorker } from '@GBR/workers/parkin/parkinWorker'
import { deepMerge, isArr, exists, uuid } from '@keg-hub/jsutils'

export type TTagsFactory = {
  index?:number,
  feature: TRaceFeature
  type?:ESectionType.tags
  parent: TRaceTagsParent
  tags?:Partial<TRaceTags>|string[]
}


export const tagsFactory = async (props:TTagsFactory) => {
  const {
    tags,
    parent,
    feature,
    type=ESectionType.tags,
  } = props

  const index = props.index || await ParkinWorker.findIndex({
    parent,
    feature,
    loc: EBlockLoc.before,
    type: ESectionType.tags,
  })
  
  const whitespace = parent?.whitespace?.length ? parent.whitespace : ``

  const block = !exists(tags)
    ? {}
    : isArr<string[]>(tags)
      ? {tokens: tags, content: tags.join(` `)}
      : tags

  return deepMerge<TRaceTags>({
    type,
    index,
    whitespace,
    tokens: [],
    content: ``,
    uuid: uuid(),
  }, block)
}
