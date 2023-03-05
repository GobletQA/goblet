import type { TAstBlock } from '@ltipton/parkin'

import { deepMerge } from '@keg-hub/jsutils'

export type TBlocksFactory = {
  blocks?:Partial<TAstBlock>[]
}

export type TBlockFactory = {
  block?:Partial<TAstBlock>,
  index?:number
}

export const blockFactory = ({
  block,
  index=0
}:TBlockFactory) => {
  return  block
    ? deepMerge<TAstBlock>({
        index,
        content: ``,
      }, block)
    : undefined
}

export const blocksFactory = ({
  blocks
}:TBlocksFactory) => {
  return blocks?.length
    ? blocks.map(block => block && blockFactory({ block })).filter(Boolean) as TAstBlock[]
    : undefined
}