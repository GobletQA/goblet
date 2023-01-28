import type { TPlayerResEvent } from '@types'

import { useState } from 'react'
import { EBrowserState } from '@types'
import { useEventListen } from '@gobletqa/components'
import { BrowserStateEvt, PlayerStartedEvent, PlayerEndedEvent } from '@constants'

export const useBrowserState = () => {

  const [browserState, setBrowserState] = useState<EBrowserState>(EBrowserState.idle)

  useEventListen(BrowserStateEvt, (event:{browserState:EBrowserState}) => {
    browserState !== event.browserState
      && setBrowserState(event.browserState)
  })

  useEventListen(PlayerStartedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.playing)
  })

  useEventListen(PlayerEndedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.idle)
  })

  return {
    browserState,
    setBrowserState
  }
}