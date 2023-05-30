import type { TThrottle } from '@types'

import { WindowResizeEvt } from '@constants'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { throttleLast as jsThrottle } from '@keg-hub/jsutils'

const throttle = jsThrottle as TThrottle

export const useWindowResize = () => {

  useEffectOnce(() => {
    // Throttle to avoid the function fire multiple times
    const onResize = throttle(
      () => EE.emit(WindowResizeEvt, { width: window.innerWidth, height: window.innerHeight }),
      null,
      1000
    )

    // Add the debounced method as the resize listener on the window
    window.addEventListener('resize', onResize)

    // Cleanup the listener on unmount
    return () => window.removeEventListener('resize', onResize)
  })

}
