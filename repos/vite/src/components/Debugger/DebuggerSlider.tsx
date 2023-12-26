/**
https://lancetipton.github.io/chrome-devtools/?ws=localhost:9222/devtools/page/F3B0A6F75E80FD8D91F62091ED606C99
curl http://localhost:19020/json -s
ws://localhost:19020/devtools/page/F3B711E4A88BE34A4B79DF01C303AA45
 */

import type { TouchEvent, MouseEvent } from 'react'

import { useState, useCallback } from 'react'
import { Debugger } from './Debugger'
import { DebuggerError } from './DebuggerError'
import { DebuggerHeader } from './DebuggerHeader'
import { getDebugUrl, getDebugHost } from '@utils/api/getDebugUrl'
import { debuggerUrl } from '@actions/screencast/api/debuggerUrl'
import {
  DebuggerBody,
  DebuggerSliderContainer,
} from './DebuggerSlider.styled'


export type TDebuggerSlider = {}


export const DebuggerSlider = (props:TDebuggerSlider) => {

  const [debugUrl, setDebugUrl] = useState<string>()
  const [debugError, setDebugError] = useState<string>()
  const [debugHost, setDebugHost] = useState<string>(getDebugHost())

  const onGetDebuggerUrl = useCallback(async (event:MouseEvent|TouchEvent) => {

    const { data, error } = await debuggerUrl()
    if(!data || error)
      return setDebugError(error || `Could not load debugger configuration`)

    const url = new URL(data.webSocketDebuggerUrl)
    const { api } = getDebugUrl(url)
    const debugUrl = `ws=${api}`

    debugUrl && setDebugUrl(debugUrl)
    debugError && setDebugError(undefined)
  }, [])


  return (
    <DebuggerSliderContainer className='gb-debugger-slider-container' >
      <DebuggerHeader
        debugUrl={debugUrl}
        debugHost={debugHost}
        onGetDebuggerUrl={onGetDebuggerUrl}
      />
      <DebuggerBody className='gb-debugger-body-container' >
        {debugError
          ? (<DebuggerError error={debugError} />) 
          : (<Debugger debugUrl={debugUrl} debugHost={debugHost} />)
        }
      </DebuggerBody>
    </DebuggerSliderContainer>
  )
}
