import type {
  TKeyboard,
  TKeyConfig,
  TKeyboardCtx,
} from '@types'
import {useCallback, useEffect} from 'react'

export const useKeyboardHooks = (props:TKeyboardCtx) => {

  const {
    keyboard
  } = props

  const onKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      // const ctrlKey = event.ctrlKey || event.metaKey

      const key = event.key.toLowerCase()
      const config = keyboard[key.toLowerCase() as keyof TKeyboard] as TKeyConfig
      if(!config) return

      if(config?.combo?.length){
        const matches = config?.combo
          .map(item => event[`${item}Key`])
          .filter(Boolean)

        if(matches.length !== config?.combo?.length) return
      }

      config.stop !== false && event.stopPropagation()
      config.prevent !== false && event.preventDefault()

      await config?.action?.(event)
    }, [keyboard])

  useEffect(()=>{
    window.parent.addEventListener("keydown", onKeyDown)
    return ()=>{
      window.parent.removeEventListener('keydown',onKeyDown)
    }
  })

}
