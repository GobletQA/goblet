import type { TThrottle } from '@types'
import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { useEffect } from 'react'
import { VNCConnectedEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { throttleLast as jsThrottle } from '@keg-hub/jsutils'

const throttle = jsThrottle as TThrottle

export type THScreenResize = {
  rfb:MutableRefObject<RFB | null>
}

export const useVncResize = (props:THScreenResize) => {
  const { rfb } = props

  useEffect(() => {
    const onResize = throttle(() => EE.emit(VNCConnectedEvt, rfb.current), null, 500)

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])
}
