import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { TXTermIdMap, TXTerminal, TXTermRef } from '@types'

import { useEffect } from 'react'
import { WindowResizeEvt } from '@constants'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type THScreenResize = {
  terminals: MutableRefObject<TXTermIdMap>
}

export const useTerminalResize = (props:THScreenResize) => {
  const { terminals } = props

  useEffectOnce(() => {
    EE.on(WindowResizeEvt, () => {
      const terms = terminals.current
      
      terms && Object.values(terms).forEach(({ term }) => {
        term.resize()
      })
    })

    return () => {
      EE.off(WindowResizeEvt, WindowResizeEvt)
    }
  })
}

