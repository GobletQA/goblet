import type { TRaceAst } from '@GBR/types'

import type { THDndData } from './useDndData'
import { useDndData } from './useDndData'

export type THDropData = Omit<THDndData, `index`|`item`> & {
  index?:number
  item?:TRaceAst
}

export const useDropData = (props:THDropData) => {
  return useDndData({
    ...props,
    index: props.index || 0,
    item: props.item || { uuid: `` } as TRaceAst
  })
}