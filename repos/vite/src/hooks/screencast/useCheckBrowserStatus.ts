import type { MutableRefObject } from 'react'

import { useCallback, useRef } from 'react'
import { statusBrowser } from '@actions/screencast/api'
import { useLoadRepoUrl } from '@hooks/screencast/useLoadRepoUrl'


export const useCheckBrowserStatus = (
  onRunningCB:(...args:any[]) => void,
) => {
  const loadRepoUrl = useLoadRepoUrl()
  const checkingStatusRef = useRef<boolean>(false)

  return useCallback(async () => {
    if(checkingStatusRef.current) return
    
    checkingStatusRef.current = true
    const resp = await statusBrowser()

    if(resp.running){
      onRunningCB?.(true)
      await loadRepoUrl?.()
    }
    checkingStatusRef.current = false
  }, [onRunningCB, loadRepoUrl])
}