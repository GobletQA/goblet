import type { CSSProperties } from 'react'
import type { VncScreenHandle } from 'react-vnc/dist/types/lib/VncScreen'

import { useRef, useCallback } from 'react'

import { useEffect } from 'react'
import { Canvas } from './Canvas'
import { noOpObj } from '@keg-hub/jsutils'
import Container from '@mui/material/Container'
import { restartBrowser } from '@actions/screencast/api'
import { useScreencastUrl }  from '@hooks/components/useScreencastUrl'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const canvasRef = useRef<VncScreenHandle>(null)
  const screencastUrl = useScreencastUrl()

  useEffect(() => {
    if(!canvasRef?.current) return
    
    const VncService = canvasRef.current
    if(VncService.connected) return

    VncService.connect()
  }, [])

  

  const onConnect = useCallback((...args:any[]) => {
    restartBrowser()
  }, [])

  return (
    <Container
      className='screencast-container'
      sx={[{
        display: `flex`,
        minHeight: `100%`,
        alignItems: `stretch`,
        backgroundColor: `#9a9a9a`,
      }, props.sx || noOpObj]}
    >
      <Canvas
        url={screencastUrl}
        canvasRef={canvasRef}
        onConnect={onConnect}
        autoConnect={false}
        scaleViewport={true}
        rfbOptions={{
          wsProtocols: ['binary', 'base64'],
        }}
      />
    </Container>
  )
}