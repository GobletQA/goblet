import { useCallback, useRef, useEffect, useState } from 'react'
import { useLoadRepoUrl } from '@hooks/screencast/useLoadRepoUrl'
import { statusBrowser } from '@actions/screencast/api/statusBrowser'


export const useCheckBrowserStatus = (
  onRunningCB:(...args:any[]) => void,
) => {
  const [loadRepoUrl, repoUrl] = useLoadRepoUrl()
  const checkingStatusRef = useRef<boolean>(false)
  const [statusFailed, setStatusFailed] = useState<boolean>(false)

  const checkStatus = useCallback(async () => {
    if(checkingStatusRef.current) return

    checkingStatusRef.current = true
    const resp = await statusBrowser()

    if(resp.running){
      onRunningCB?.(true)
      await loadRepoUrl?.()
    }
    else setStatusFailed(true)

    checkingStatusRef.current = false
  }, [onRunningCB, loadRepoUrl])

  useEffect(() => {
    if(!statusFailed) return

    console.log(`Browser status failed; trying again in 1 second...`)

    const timer = setTimeout(() => {
      setStatusFailed(false)
      checkStatus()
    }, 1000)
    
    // TODO: investigate cleanup method here
    return () => {
      clearTimeout(timer)
    }
    
  }, [
    statusFailed,
    checkingStatusRef.current
  ])

  return [checkStatus, repoUrl] as [(...args:any[]) => any, string]
}