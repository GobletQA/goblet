import type { CSSProperties } from 'react'
import type { RFBOptions, VncScreenHandle } from 'react-vnc/dist/types/lib/VncScreen'

import { useRef } from 'react'

import { Canvas } from './Canvas'
import { noOpObj } from '@keg-hub/jsutils'
import Container from '@mui/material/Container'
import { useScreencastUrl }  from '@hooks/components/useScreencastUrl'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const canvasRef = useRef<VncScreenHandle>(null)
  const screencastUrl = useScreencastUrl()
  
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
        autoConnect={false}
        scaleViewport={true}
        rfbOptions={{
          wsProtocols: ['binary', 'base64'],
        }}
      />
    </Container>
  )
}