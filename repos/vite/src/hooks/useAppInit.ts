import type { Dispatch, SetStateAction } from 'react'
import { useState, useEffect, useRef } from 'react'
import { initApp } from '@actions/init'

const onAppInit = async (
  setApiTimeout:Dispatch<SetStateAction<string|false>>,
  setStart:Dispatch<SetStateAction<boolean>>
) => {
  let timeout:NodeJS.Timeout

  new Promise((res, rej) => {
    timeout = setTimeout(() => rej(), 3000)
    return initApp()
      .then(() => res(clearTimeout(timeout)))
      .catch((err:any) => {
        clearTimeout(timeout)
        rej(err)
      })
  })
  .then(() => setStart(true))
  .catch((err:any) => setApiTimeout(err?.message || `Backend API Server is not responding`))
}

export const useAppInit = () => {
  const appInitRef = useRef<boolean>(false)
  const [start, setStart] = useState(false)
  const [apiTimeout, setApiTimeout] = useState<string|false>(false)

  useEffect(() => {
    if(appInitRef.current) return

    appInitRef.current = true
    onAppInit(setApiTimeout, setStart)
  }, [])

  return {
    start,
    apiTimeout
  }
}
