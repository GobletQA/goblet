import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { useEffect } from 'react'
import { debounce } from '@keg-hub/jsutils'

export type THScreenResize = {
  rfb:MutableRefObject<RFB | null>
}

export const useScreenResize = (props:THScreenResize) => {
  useEffect(() => {

    const onResize = debounce(() => {
      
    })

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])
}
