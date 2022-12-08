import type { TBrowserNavEvt } from '@types'
import type RFB from '@novnc/novnc/core/rfb'
import type { RefObject } from 'react'

import { useRef } from 'react'
import { BrowserNavEvt } from '@constants'
import { useInline } from '@hooks/useInline'
import { pageService } from '@services/pageService'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TUpdateUrl = (
  newUrl: string | undefined,
  type: "backward" | "input" | "forward" | "external"
) => any

export type THUpdateUrl = {
  backAmount:number
  initialUrl:string
  inputRef:RefObject<HTMLInputElement>
  setBackAmount: (amount:number) => void
}

export const useUpdateUrl = (props:THUpdateUrl) => {
  const {
    inputRef,
    initialUrl,
    backAmount,
    setBackAmount
  } = props

  const urlRef = useRef<string>(initialUrl)
  const backAmountRef = useRef<number>(backAmount)
  

  const updateUrl = useInline(async(
    newUrl:string|undefined,
  ) => {

    const url = urlRef.current
    if(!newUrl) return
    const normalized = pageService.normalize(newUrl)
    if(newUrl === url || normalized === url) return

    inputRef.current && (inputRef.current.value = normalized)

    if(backAmountRef.current === backAmount){
      const update = backAmount + 1 
      setBackAmount(update)
      backAmountRef.current = update
    }
    else backAmountRef.current = backAmount

    urlRef.current = normalized

  })

  useEffectOnce(() => {
    const off = EE.on<TBrowserNavEvt>(BrowserNavEvt, data => updateUrl(data?.url))
    return () => { off?.() }
  })

  return {
    updateUrl,
    url: urlRef.current,
  }

}
