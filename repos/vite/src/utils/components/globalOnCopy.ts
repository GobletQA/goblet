import type { TGlobalCopyEvent } from '@types'

import { GlobalCopyEvt } from '@constants'
import { EE } from '@services/sharedService'

const addCopyToDocument = () => {
  document.oncopy = async (event:Event) => {
    const text = window.getSelection?.()?.toString()
    text && EE.emit<TGlobalCopyEvent>(GlobalCopyEvt, { text })
  }
}

typeof window !== `undefined` && addCopyToDocument()