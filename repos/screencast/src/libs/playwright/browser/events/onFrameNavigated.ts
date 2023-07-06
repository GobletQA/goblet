import type { Frame } from 'playwright'
import type { TBrowserEventArgs, TBrowserPage } from '@GSC/types'

import { EBrowserEvent } from '@GSC/types'
// import { symParse } from '@GSC/libs/symplasm'
import { WS_PW_URL_CHANGE } from '@GSC/constants'

export const onFrameNavigated = ({ socket, Manager }:TBrowserEventArgs) => {
  return async (page:TBrowserPage, frame:Frame) => {
    /**
      * Check if frame is the top most frame
      * If frame if parent, then response is null
      * Any child frames will return the parent
      * And we don't want to track their navigation, so return in those cases
      */
    if(frame.parentFrame()) return

    const url = frame.url()
    // const content = await frame.locator(`body`).innerHTML()
    // const ast = symParse(content)

    Manager.emit(
      socket,
      WS_PW_URL_CHANGE,
      {data: { url, ast: [] },
      group: socket.id
    })
  }
}

onFrameNavigated.event = EBrowserEvent.framenavigated
