import type { CSSProperties } from 'react'
import type { TCanvasHandle } from '@types'

import { useRef, useCallback, useState } from 'react'
import { Canvas } from './Canvas'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'
import { statusBrowser } from '@actions/screencast/api'
import { useScreencastUrl }  from '@hooks/screencast/useScreencastUrl'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

const LoadingProps = {
  speed: 500,
  styles: {
    main: {
      height: `100%`,
      position: `absolute`,
    },
    view: {
      top: `initial`
    }
  }
}

export const Screencast = (props:TScreencastProps) => {
  const vncRef = useRef<TCanvasHandle>(null)
  const screencastUrl = useScreencastUrl()
  const [fadeStart, setFadeStart] = useState<boolean>(false)

  useEffect(() => {
    if(!vncRef?.current) return

    const VncService = vncRef.current
    if(VncService.connected) return

    VncService.connect()

  }, [screencastUrl])

  const onConnect = useCallback(async (...args:any[]) => {
    // TODO: need to figure out a solution for this
    // Should call restart browser only when it's not already running
    // Right now it calls it every time
    // const resp = await  restartBrowser()
    const resp = await statusBrowser()
    if(resp.running) setFadeStart(true)
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
        position: `relative`,
        alignItems: `stretch`,
        backgroundColor: `#9a9a9a`,
      }, props.sx || noOpObj]}
    >
      <Canvas
        ref={vncRef}
        url={screencastUrl}
        onConnect={onConnect}
        autoConnect={false}
        scaleViewport={true}
        forceShowLoading={true}
        loadingProps={{
          ...LoadingProps,
          start: fadeStart,
        }}
        className='screencast-browser'
        rfbOptions={{
          wsProtocols: ['binary', 'base64'],
        }}
      />
    </Box>
  )
}