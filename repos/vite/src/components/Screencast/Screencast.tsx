import type { CSSProperties } from 'react'

import { useMemo } from 'react'
import { Canvas } from './Canvas'
import Box from '@mui/material/Box'
import { noOpObj } from '@keg-hub/jsutils'

import { useScreencastHooks } from '@hooks/screencast/useScreencastHooks'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

const RFBOpts = {
  wsProtocols: ['binary', 'base64']
}

const canvasStyle = {
  minWidth: `100%`
}

const LoadingProps = {
  speed: 800,
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

const useLoadingProps = (start:boolean) => {
  return useMemo(() => {
    return {
      ...LoadingProps,
      start,
    }
  }, [start])
}

export const Screencast = (props:TScreencastProps) => {
  const {
    vncRef,
    fadeStart,
    onConnect,
    onKeyDown,
    onClipboard,
    onDisconnect,
    screencastUrl,
  } = useScreencastHooks()

  const loadingProps = useLoadingProps(fadeStart)

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
        style={canvasStyle}
        url={screencastUrl}
        autoConnect={false}
        scaleViewport={true}
        rfbOptions={RFBOpts}
        onConnect={onConnect}
        onKeyDown={onKeyDown}
        forceShowLoading={true}
        onClipboard={onClipboard}
        onDisconnect={onDisconnect}
        loadingProps={loadingProps}
        className='screencast-browser'
      />
    </Box>
  )
}