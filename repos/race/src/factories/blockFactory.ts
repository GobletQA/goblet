import type { TRaceBlock } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'

export type TBlocksFactory = {
  blocks?:Partial<TRaceBlock>[]
}

export type TBlockFactory = {
  block?:Partial<TRaceBlock>,
  index?:number
}

export const blockFactory = ({
  block,
  index=0
}:TBlockFactory) => {
  return  block
    ? deepMerge<TRaceBlock>({
        index,
        content: ``,
      }, block)
    : undefined
}

export const blocksFactory = ({
  blocks
}:TBlocksFactory) => {
  return blocks?.length
    ? blocks.map(block => block && blockFactory({ block })).filter(Boolean) as TRaceBlock[]
    : undefined
}