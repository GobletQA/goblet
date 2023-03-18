import type { TBlockType, TRaceFeature, TRaceBlock } from '@GBR/types'

import { ESectionType } from '@GBR/types'
import { deepMerge } from '@keg-hub/jsutils'

export type TBlocksFactory = {
  type?:TBlockType
  blocks?:Partial<TRaceBlock>[]
  feature: TRaceFeature
}

export type TBlockFactory = {
  type?:TBlockType
  block?:Partial<TRaceBlock>
  index?:number,
  feature: TRaceFeature
}

export const blockFactory = ({
  type,
  block,
  index=0
}:TBlockFactory) => {
  return  block
    ? deepMerge<TRaceBlock>({
        index,
        content: ``,
        type: type || ESectionType.block
      }, block)
    : undefined
}

export const blocksFactory = ({
  type,
  blocks,
  feature
}:TBlocksFactory) => {
  return blocks?.length
    ? blocks.map(block => block && blockFactory({ block, feature, type }))
        .filter(Boolean) as TRaceBlock[]
    : undefined
}