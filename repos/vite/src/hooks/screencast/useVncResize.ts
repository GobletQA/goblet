import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { useEffect } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { VNCResizeEvt, WindowResizeEvt } from '@constants'

export type THScreenResize = {
  rfb:MutableRefObject<RFB | null>
}

export const useVncResize = (props:THScreenResize) => {
  const { rfb } = props

  useEffect(() => {
    // On a window resize event, emit a VNC connected event to reset the browser
    const off = EE.on(WindowResizeEvt, () => EE.emit(VNCResizeEvt, rfb.current))

    return () => {
      off?.()
    }
  }, [])
}
