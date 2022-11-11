import type { CSSProperties } from 'react'
import type { TVncScreenHandle } from './vnc.types'

import { useRef, useCallback } from 'react'
import { Vnc } from './Vnc'
import { useEffect } from 'react'
import { Canvas } from './Canvas'
import { noOpObj } from '@keg-hub/jsutils'
import Box from '@mui/material/Box'
import { restartBrowser } from '@actions/screencast/api'
import { useScreencastUrl }  from '@hooks/components/useScreencastUrl'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const vncRef = useRef<TVncScreenHandle>(null)
  const screencastUrl = useScreencastUrl()

  useEffect(() => {
    if(!vncRef?.current) return

    const VncService = vncRef.current
    if(VncService.connected) return

    VncService.connect()
    

  }, [screencastUrl])

  const onConnect = useCallback((...args:any[]) => {
    // restartBrowser()
    const VncService = vncRef.current
    if(!VncService?.screen?.current) return 

    VncService.screen.current.style.minHeight = `100%`
    VncService.screen.current.style.minWidth = `100%`
  }, [])

  return (
    <Box
      className='screencast-container'
      sx={[{
        display: `flex`,
        minHeight: `100%`,
        alignItems: `stretch`,
        backgroundColor: `#9a9a9a`,
      }, props.sx || noOpObj]}
    >
      <Vnc
        ref={vncRef}
        url={screencastUrl}
        onConnect={onConnect}
        autoConnect={false}
        scaleViewport={true}
        className='screencast-browser'
        rfbOptions={{
          wsProtocols: ['binary', 'base64'],
        }}
      />
    </Box>
  )
}