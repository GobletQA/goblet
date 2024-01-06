import type { TBrowserStateEvt, TPlayerResEvent } from '@types'

import { useState } from 'react'
import { EBrowserState } from '@types'
import { useOnEvent } from '@gobletqa/components'
import { BrowserStateEvt, PlayerStartedEvent, PlayerFinishedEvent } from '@constants'

export const useBrowserState = () => {

  const [browserState, setBrowserState] = useState<EBrowserState>(EBrowserState.idle)

  useOnEvent<TBrowserStateEvt>(BrowserStateEvt, (event) => {
    browserState !== event.browserState
      && setBrowserState(event.browserState)
  })

  useOnEvent(PlayerStartedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.playing)
  })

  useOnEvent(PlayerFinishedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.idle)
  })

  return {
    browserState,
    setBrowserState,
  }
}