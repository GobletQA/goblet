import type { RefObject } from 'react'
import type { TBrowserNavEvt } from '@types'

import { BrowserNavEvt } from '@constants'
import { useCallback, useRef } from 'react'
import { useOnEvent } from '@gobletqa/components'
import { pageService } from '@services/pageService'

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
  

  const updateUrl = useCallback(async(
    newUrl:string|undefined,
  ) => {

    const url = urlRef.current
    if(!newUrl) return

    const normalized = pageService.normalize(newUrl)
    if(!normalized || newUrl === url || normalized === url) return

    inputRef.current && (inputRef.current.value = normalized)

    if(backAmountRef.current === backAmount){
      const update = backAmount + 1 
      setBackAmount(update)
      backAmountRef.current = update
    }
    else backAmountRef.current = backAmount

    urlRef.current = normalized

  }, [backAmount, setBackAmount])

  useOnEvent<TBrowserNavEvt>(BrowserNavEvt, data => updateUrl(data?.url))

  return {
    updateUrl,
    url: urlRef.current,
  }

}
