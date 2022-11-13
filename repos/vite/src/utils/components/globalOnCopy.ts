import { GlobalCopyEvt } from '@constants'
import { TGlobalCopyEvent } from '@types'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

const addCopyToDocument = () => {
  document.oncopy = async (event:Event) => {
    const text = window.getSelection?.()?.toString()
    text && EE.emit<TGlobalCopyEvent>(GlobalCopyEvt, { text })
  }
}

typeof window !== `undefined` && addCopyToDocument()