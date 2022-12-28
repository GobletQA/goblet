import type { SyntheticEvent } from 'react'
import type { TTabAction, TTabItem, TTab } from '../../types'

import { useCallback } from 'react'
import { noOp } from '@keg-hub/jsutils'
import { useInline } from '../useInline'


const useWrapCallback = (tab:TTab, callback:TTabAction=noOp) => {
  const inlineCB = useInline(callback)
  
  return useCallback((event:SyntheticEvent) =>
    inlineCB?.(event, tab, tab?.uuid || tab?.path),
    [tab]
  )
}

export const useTabCallbacks = (props:TTabItem) => {

  const {
    tab,
    onTabDown,
    onTabHover,
    onTabLeave,
    onTabClose,
    onTabClick,
  } = props

  return {
    onTabDown: useWrapCallback(tab, onTabDown),
    onTabLeave: useWrapCallback(tab, onTabLeave),
    onTabClose: useWrapCallback(tab, onTabClose),
    onTabHover: useWrapCallback(tab, onTabHover),
    onTabClick: useWrapCallback(tab, onTabClick),
  }
  
}