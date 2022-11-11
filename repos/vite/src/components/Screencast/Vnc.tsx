import type { TVncProps, TVncScreenHandle } from './vnc.types'

import { useVncRefs } from './useVncRefs'
import { useRFBHooks } from './useRFBHooks'
import { useVncHooks } from './useVncHooks'
import { Loading } from '@components/Loading'
import { useVncHandlers } from './useVncHandlers'
import React, { forwardRef, useImperativeHandle } from 'react'

const VncLoading = () => {
  return (
    <Loading
      size={30}
      color={`secondary`}
      message={`Browser Loading`}
      containerSx={{
        width: `100%`,
        alignSelf: `center`,
      }}
    />
  )
}

const VncScreen: React.ForwardRefRenderFunction<TVncScreenHandle, TVncProps> = (props, ref) => {

  const {
    style,
    className,
    loadingUI,
    elementAttrs,
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

  const { connect } = useVncHooks(props, {
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
      {loading && (loadingUI ?? <VncLoading />)}
    </>
  )
}

export const Vnc = forwardRef(VncScreen)
