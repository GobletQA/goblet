import type { TBrowserProps, TBrowserHandle } from '@types'

import React, { forwardRef, useImperativeHandle } from 'react'

import Box from '@mui/material/Box'
import { BrowserNav } from './BrowserNav'
import { BrowserView } from './Browser.styled'
import { BrowserLoading } from './BrowserLoading'
import { useVncRefs } from '@hooks/screencast/useVncRefs'
import { useRFBHooks } from '@hooks/screencast/useRFBHooks'
import { useVncHooks } from '@hooks/screencast/useVncHooks'
import { useVncHandlers } from '@hooks/screencast/useVncHandlers'


const loadingStyles = {
  main: {
    height: `100%`,
    position: `absolute`,
  },
  view: {
    top: `initial`
  }
}

const BrowserComp: React.ForwardRefRenderFunction<TBrowserHandle, TBrowserProps> = (props, ref) => {

  const {
    style,
    className,
    displayUrl,
    elementAttrs,
    loadingProps,
    loadingFadeout,
    forceShowLoading,
    autoConnect = true,
  } = props

  const {
    rfb,
    logger,
    screen,
    loading,
    timeouts,
    connected,
    setLoading,
    connectRef,
    disconnectRef,
    eventListeners
  } = useVncRefs(props)

  const {
    connect,
    _onDisconnect
  } = useVncHooks(props, {
    rfb,
    screen,
    logger,
    timeouts,
    connected,
    setLoading,
    connectRef,
    disconnectRef,
    eventListeners,
  })

  const {
    blur,
    focus,
    sendKey,
    disconnect,
    machineReset,
    machineReboot,
    clipboardPaste,
    sendCtrlAltDel,
    machineShutdown,
    sendCredentials,
  } = useRFBHooks(props, {
    rfb,
    screen,
    logger,
    timeouts,
    connected,
    connectRef,
    setLoading,
    _onDisconnect,
    disconnectRef,
    eventListeners,
  })

  const {
    onMouseEnter,
    onMouseLeave,
  } = useVncHandlers({
    rfb,
    connect,
    disconnect,
    autoConnect
  })

  useImperativeHandle(ref, () => ({
    blur,
    focus,
    screen,
    connect,
    sendKey,
    disconnect,
    machineReset,
    machineReboot,
    sendCtrlAltDel,
    clipboardPaste,
    sendCredentials,
    machineShutdown,
    rfb: rfb.current,
    connected: connected.current,
    eventListeners: eventListeners.current,
  }))

  return (
    <>
      <BrowserNav
        loading={loading}
        initialUrl={displayUrl}
      />
      <Box
        className='screencast-container'
        sx={{
          display: `flex`,
          minHeight: `100%`,
          position: `relative`,
          alignItems: `stretch`,
          backgroundColor: `#9a9a9a`,
        }}
      >
        <BrowserView
          style={style}
          {...elementAttrs}
          ref={screen}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {(forceShowLoading || loading)
          && (
            <BrowserLoading
              speed={800}
              loading={loading}
              styles={loadingStyles}
              start={loadingFadeout}
              forced={forceShowLoading}
              {...loadingProps}
            />
          )}
      </Box>
    </>
  )
}

export const Browser = forwardRef(BrowserComp)
