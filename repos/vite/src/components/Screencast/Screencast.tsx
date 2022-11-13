import type { CSSProperties } from 'react'
import type RFB from '@novnc/novnc/core/rfb'
import type { TGlobalCopyEvent, TCanvasDetailEvt, TCanvasHandle } from '@types'


import { useRef, useCallback, useState, useEffect } from 'react'
import { Canvas } from './Canvas'
import Box from '@mui/material/Box'
import { GlobalCopyEvt } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { Clipboard } from '@gobletqa/shared/frontend/dom/clipBoard'
import { useScreencastUrl }  from '@hooks/screencast/useScreencastUrl'
import { useCheckBrowserStatus } from '@hooks/screencast/useCheckBrowserStatus'


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

    const Vnc = vncRef.current
    if(Vnc.connected) return

    Vnc.connect()

  }, [screencastUrl])

  const checkStatus = useCheckBrowserStatus(setFadeStart)

  const onConnect = useCallback(async (...args:any[]) => {
    await checkStatus()

    const Vnc = vncRef.current
    if(!Vnc?.screen?.current) return

    Vnc.screen.current.style.minHeight = `100%`
    Vnc.screen.current.style.minWidth = `100%`
  }, [checkStatus])

  const onDisconnect = useCallback(async (rfb?:RFB) => {
    const Vnc = vncRef.current
    if(!Vnc || !Vnc.screen?.current?.childNodes.length){
      setFadeStart(false)
      return setTimeout(() => checkStatus(), 3000)
    }
    // TODO: need to figure out other disconnect scenarios and handle them gracefully
  }, [checkStatus])

  const onClipboard = useCallback(async (evt?:TCanvasDetailEvt) => {
    const text = evt?.detail?.text
    text && await Clipboard.copyText(text)
  }, [])

  useEffect(() => {
    EE.on<TGlobalCopyEvent>(GlobalCopyEvt, ({ text }) => {
      vncRef?.current?.clipboardPaste(text)
    }, GlobalCopyEvt)

    // console.log(`------- calling f8 -------`)
    // vncRef?.current?.sendKey(0, `F8`)

    return () => {
      EE.off<TGlobalCopyEvent>(GlobalCopyEvt)
    }
  }, [])

  const onKeyDown = (event:Event) => {
    // TODO: add check here for it on mac
    // Re-Map the keys command / ctrl keys if possible
    // Have to use ctl when on vnc screen
    // event.stopPropagation()
    // event.preventDefault()
  }

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
        autoConnect={false}
        scaleViewport={true}
        onConnect={onConnect}
        onKeyDown={onKeyDown}
        forceShowLoading={true}
        onClipboard={onClipboard}
        onDisconnect={onDisconnect}
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