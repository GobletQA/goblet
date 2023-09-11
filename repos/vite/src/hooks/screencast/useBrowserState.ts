import type { TPlayerResEvent } from '@types'

import { useState } from 'react'
import { EBrowserState } from '@types'
import { useOnEvent } from '@gobletqa/components'
import { BrowserStateEvt, PlayerStartedEvent, PlayerEndedEvent } from '@constants'

export const useBrowserState = () => {

  const [browserState, setBrowserState] = useState<EBrowserState>(EBrowserState.idle)

  useOnEvent(BrowserStateEvt, (event:{browserState:EBrowserState}) => {
    browserState !== event.browserState
      && setBrowserState(event.browserState)
  })

  useOnEvent(PlayerStartedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.playing)
  })

  useOnEvent(PlayerEndedEvent, (event:TPlayerResEvent) => {
    setBrowserState(EBrowserState.idle)
  })

  return {
    browserState,
    setBrowserState,
  }
}