/**
https://lancetipton.github.io/chrome-devtools/?ws=localhost:9222/devtools/page/F3B0A6F75E80FD8D91F62091ED606C99
curl http://localhost:19020/json -s
ws://localhost:19020/devtools/page/F3B711E4A88BE34A4B79DF01C303AA45
 */

import type { TouchEvent, MouseEvent } from 'react'

import { Debugger } from './Debugger'
import { ife } from '@keg-hub/jsutils/ife'
import { DebuggerError } from './DebuggerError'
import { DebuggerHeader } from './DebuggerHeader'
import { Loading, useEffectOnce } from '@gobletqa/components'
import { useState, useCallback, useMemo } from 'react'
import { getDebugUrl, getDebugHost } from '@utils/api/getDebugUrl'
import { debuggerUrl } from '@actions/screencast/api/debuggerUrl'
import {
  DebuggerBody,
  DebuggerLoading,
  DebuggerSliderContainer,
} from './DebuggerSlider.styled'


export type TDebuggerSlider = {
  onOpen?:() => void
  onClose?:() => void
}

const loadDebugUrl = async () => {
  const { data, error } = await debuggerUrl()
  if(!data || error)
    return { url: undefined,  error: error || `Could not load debugger configuration` }

  const url = new URL(data.webSocketDebuggerUrl)
  const { api } = getDebugUrl(url)

  return { url:`ws=${api}`, error }
}

export type TUpdateDebugUrl = {
  loading?:boolean
  debugError?:string
  setDebugUrl:(url:string) => void
  setLoading:(status:boolean) => void
  setDebugError:(err?:string) => void
}

const updateDebugUrl = async (props:TUpdateDebugUrl) => {
  const {
    loading,
    setLoading,
    debugError,
    setDebugUrl,
    setDebugError
  } = props
  
  !loading && setLoading(true)
  const { url, error } = await loadDebugUrl()
  url && setDebugUrl(url)

  ;(error || !url)
    ? setDebugError(error || `Could not load debugger configuration`)
    : debugError && setDebugError(undefined)

  setLoading(false)
}


export const DebuggerSlider = (props:TDebuggerSlider) => {
  const {
    onOpen,
    onClose
  } = props

  const debugHost = useMemo(() => getDebugHost(), [])
  const [debugUrl, setDebugUrl] = useState<string>()
  const [debugError, setDebugError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  const onReloadUrl = useCallback(async (evt:MouseEvent|TouchEvent) => {
    setDebugUrl(undefined)

    await updateDebugUrl({
      loading,
      debugError,
      setLoading,
      setDebugUrl,
      setDebugError
    })
  }, [])

  useEffectOnce(() => {
    onOpen?.()

    ife(async () => await updateDebugUrl({
      loading,
      debugError,
      setLoading,
      setDebugUrl,
      setDebugError
    }))

    return () => {
      onClose?.()
    }
  })

  return (
    <DebuggerSliderContainer className='gb-debugger-slider-container' >
      {!loading && (
        <DebuggerHeader
          debugUrl={debugUrl}
          debugHost={debugHost}
          onReloadUrl={onReloadUrl}
        />
      )}
      <DebuggerBody className='gb-debugger-body-container' >
        {
          loading
            ? (<DebuggerLoading message={`Inspector Loading`} />)
            : debugError
              ? (<DebuggerError error={debugError} />) 
              : (<Debugger debugUrl={debugUrl} debugHost={debugHost} />)
        }
      </DebuggerBody>
    </DebuggerSliderContainer>
  )
}
