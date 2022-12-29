import type { MutableRefObject } from 'react'
import type { TXTermIdMap, TXTerminal, TXTermRef } from '@types'

import { useEffect, useRef } from 'react'
import { noOpObj } from '@keg-hub/jsutils'
import { XTerminal } from '@services/xterm'
import { gutter } from '@gobletqa/components/theme'
import { useEffectOnce } from '@hooks/useEffectOnce'
import { useTerminalTheme } from './useTerminalTheme'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { PanelDimsSetEvt, ResizePanelSplitClass } from '@constants'

const setTerminalElement = (term:XTerminal) => {
  const element = term?.xterm?.element
  if(!element)
    return console.log(`Can not set terminal height. Terminal element does not exist`, term)
  
  const panelEl = element.closest(ResizePanelSplitClass) as HTMLElement
  if(!panelEl)
    return console.log(`Can not set terminal height. Parent panel does not exist`, term, element)
  
  const panelHeight = panelEl?.offsetHeight
  element.style.paddingTop = gutter.padding.px
  element.style.paddingLeft = gutter.padding.px

  // Add 10 extra px for offset at the bottom, so it gives a little space
  element.style.maxHeight = `${panelHeight - (gutter.padding.size + 10)}px`

  // Resize the terminal based on adjusted height
  term?.resize()
}


export const useXTerminal = (props:Partial<TXTerminal>=noOpObj, id?:string) => {
  const termId:string = id || props.id || ``
  const termRefs = useRef<TXTermIdMap>({} as TXTermIdMap)

  const terminalTheme = useTerminalTheme()
  const existing = termRefs.current?.[termId]?.element
  const termElRef = useRef<HTMLDivElement|null>(existing?.current || null)

  useEffectOnce(() => {
    EE.on(PanelDimsSetEvt, () => {
      termId
        && termRefs.current[termId]?.term
        && setTerminalElement(termRefs.current[termId].term)
    }, `${PanelDimsSetEvt}-resize`)
    
    return () => {
      EE.off(PanelDimsSetEvt, `${PanelDimsSetEvt}-resize`)
    }
  })

  useEffect(() => {
    if(existing || !termId || termRefs?.current?.[termId] || !termElRef?.current)
      return undefined

    termRefs.current[termId] = {
      element: termElRef,
      themeMode: terminalTheme.mode,
      term: new XTerminal({
        ...props,
        id: termId,
        element: termElRef.current,
        theme: terminalTheme?.theme,
      }),
      remove: () => {
        termRefs.current[termId]
          && termRefs.current?.[termId]?.term?.remove?.()

        delete termRefs.current[termId]
      }
    }

    setTerminalElement(termRefs.current[termId].term)

  }, [props, termId, terminalTheme])


  useEffect(() => {

    Object.values(termRefs.current)
      .forEach(termRef => {
        termRef.themeMode !== terminalTheme.mode
          && termRef.term.setOption(`theme`, terminalTheme.theme)
      })

  }, [terminalTheme.mode])
  
  

  const activeRef = termRefs.current[termId] || { element: termElRef }

  return [activeRef, termRefs] as [TXTermRef, MutableRefObject<TXTermIdMap>]
}