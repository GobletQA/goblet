import type { MutableRefObject } from 'react'

import { ScreencastBrowserSelector } from '@constants'
import { useMutationObserver } from '@hooks/components/useMutationObserver'

export type THWatchScreen = {
  screenRef:MutableRefObject<Element | null>
}

export const useWatchScreen = (props:THWatchScreen) => {
  const { screenRef } = props

  useMutationObserver({
    subtree: true,
    childList: true,
    elementRef: screenRef,
    selector:ScreencastBrowserSelector,
    cb: (mutationList, observer) => {}
  })
}