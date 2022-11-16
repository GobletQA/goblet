import type { TBrowserProps, TBrowserHandle } from '@types'

import React, { forwardRef, useImperativeHandle } from 'react'

import { BrowserLoading } from './BrowserLoading'
import { useVncRefs } from '@hooks/screencast/useVncRefs'
import { useRFBHooks } from '@hooks/screencast/useRFBHooks'
import { useVncHooks } from '@hooks/screencast/useVncHooks'
import { useVncHandlers } from '@hooks/screencast/useVncHandlers'


const BrowserComp: React.ForwardRefRenderFunction<TBrowserHandle, TBrowserProps> = (props, ref) => {

  const {
    style,
    className,
    elementAttrs,
    loadingProps,
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
      <div
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
            loading={loading}
            forced={forceShowLoading}
            {...loadingProps}
          />
        )}
    </>
  )
}

export const Browser = forwardRef(BrowserComp)
