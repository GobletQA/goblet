import type { SyntheticEvent } from 'react'
import type { TTabAction, TTabItem, TTab } from '../../types'

import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useInline } from '../components/useInline'
import {scrollToTab} from '@GBC/utils/components/scrollToTab'

const useWrapCallback = (
  tab:TTab,
  callback:TTabAction=noOp,
  scrollToClick:boolean=true
) => {
  const inlineCB = useInline(callback)

  return useCallback((event:SyntheticEvent) => {
      event.type === `click`
        && scrollToClick
        && scrollToTab(event)

    inlineCB?.(tab, event, tab?.uuid || tab?.path)
  }, [tab])
}

export const useTabCallbacks = (props:TTabItem) => {

  const {
    tab,
    onTabDown,
    onTabHover,
    onTabLeave,
    onTabClose,
    onTabClick,
    scrollToClick,
  } = props

  return {
    onTabDown: useWrapCallback(tab, onTabDown),
    onTabLeave: useWrapCallback(tab, onTabLeave),
    onTabClose: useWrapCallback(tab, onTabClose),
    onTabHover: useWrapCallback(tab, onTabHover),
    onTabClick: useWrapCallback(tab, onTabClick, scrollToClick),
  }
  
}