import type { TAstBlock } from '@GBR/types'

import { deepMerge } from '@keg-hub/jsutils'

export const blockFactory = (block?:Partial<TAstBlock>, index:number=0) => {
  return  block
    ? deepMerge<TAstBlock>({
        index,
        content: ``,
      }, block)
    : undefined
}

export const blocksFactory = (blocks?:Partial<TAstBlock>[]) => {
  return blocks?.length
    ? blocks.map(block => block && blockFactory(block)).filter(Boolean) as TAstBlock[]
    : undefined
}