/**
https://lancetipton.github.io/chrome-devtools/?ws=localhost:9222/devtools/page/F3B0A6F75E80FD8D91F62091ED606C99
curl http://localhost:9020/json -s
ws://localhost:9020/devtools/page/F3B711E4A88BE34A4B79DF01C303AA45
 */

import type { TouchEvent, MouseEvent } from 'react'

import { useState, useCallback } from 'react'
import { Debugger } from './Debugger'
import { DebuggerError } from './DebuggerError'
import { DebuggerHeader } from './DebuggerHeader'
import { getDebugUrl } from '@utils/api/getDebugUrl'
import { debuggerUrl } from '@actions/screencast/api/debuggerUrl'
import {
  DebuggerBody,
  DebuggerSliderContainer,
} from './DebuggerSlider.styled'


export type TDebuggerSlider = {}


export const DebuggerSlider = (props:TDebuggerSlider) => {

  const [debugUrl, setDebugUrl] = useState<string>()
  const [debugError, setDebugError] = useState<string>()

  const onGetDebuggerUrl = useCallback(async (event:MouseEvent|TouchEvent) => {

    const { data, error } = await debuggerUrl()
    if(!data || error)
      return setDebugError(error || `Could not load debugger configuration`)


    const main = getDebugUrl()
    const url = new URL(data.webSocketDebuggerUrl)
    const debugUrl = `?ws=${main}&debugger=${url.host}${url.pathname}`
    
    console.log(`------- debugUrl -------`)
    console.log(debugUrl)

    debugUrl && setDebugUrl(debugUrl)
    debugError && setDebugError(undefined)
  }, [])


  return (
    <DebuggerSliderContainer className='gb-debugger-slider-container' >
      <DebuggerHeader
        debugUrl={debugUrl}
        onGetDebuggerUrl={onGetDebuggerUrl}
      />
      <DebuggerBody>
        {debugError
          ? (<DebuggerError error={debugError} />) 
          : (<Debugger debugUrl={debugUrl} />)
        }
      </DebuggerBody>
    </DebuggerSliderContainer>
  )
}
