import type { TAstBlock } from '@GBR/types'

import { deepMerge, emptyArr, emptyObj } from '@keg-hub/jsutils'

export const blockFactory = (block?:Partial<TAstBlock>) => {
  return  block
    ? deepMerge<TAstBlock>({
        index: 0,
        content: ``,
      }, block)
    : undefined
}

export const blocksFactory = (blocks?:Partial<TAstBlock>[]) => {
  return blocks?.length
    ? blocks.map(block => block && blockFactory(block)).filter(Boolean) as TAstBlock[]
    : undefined
}