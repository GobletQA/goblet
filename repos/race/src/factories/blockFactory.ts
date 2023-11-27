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

export const blockFactory = async ({
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

export const blocksFactory = async ({
  type,
  blocks,
  feature
}:TBlocksFactory) => {
  if(!blocks?.length) return undefined

  const built = await Promise.all(blocks.map(async (block) => block && await blockFactory({ block, feature, type })))

  return built.filter(Boolean) as TRaceBlock[]

}