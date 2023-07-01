import type { TInputDecor } from '@GBC/types'

import { useMemo } from 'react'
import { emptyObj } from '@keg-hub/jsutils'

export type THDecor = {
  decor?:TInputDecor
}

export const useDecor = (props:THDecor) => {

  const { decor } = props

  return useMemo(() => {
    if(!decor || !decor.Component) return emptyObj as any

    const { decorPos=`start` } = decor
    const decorKey = decorPos === `end` ? `endAdornment` : `startAdornment`

    return {
      decorKey,
      decorProps: decor,
    }
  }, [decor,])


}