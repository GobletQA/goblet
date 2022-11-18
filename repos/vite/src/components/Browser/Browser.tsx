import type { TBrowserProps, TBrowserHandle } from '@types'

import React, { forwardRef, useImperativeHandle } from 'react'

import { cls } from '@keg-hub/jsutils'
import { BrowserNav } from './BrowserNav'
import { BrowserLoading } from './BrowserLoading'
import { ScreencastBrowserSelector } from '@constants'
import { useVncRefs } from '@hooks/screencast/useVncRefs'
import { useRFBHooks } from '@hooks/screencast/useRFBHooks'
import { useVncHooks } from '@hooks/screencast/useVncHooks'
import { useVncHandlers } from '@hooks/screencast/useVncHandlers'
import {
  BrowserView,
  BrowserContainer,
  BrowserViewContainer
} from './Browser.styled'

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
    onScreenNode,
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
    <BrowserContainer className='browser-container'>
      <BrowserNav
        loading={loading}
        initialUrl={displayUrl}
      />
      <BrowserViewContainer className='browser-view-container'>
        <BrowserView
          style={style}
          {...elementAttrs}
          ref={onScreenNode}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          id={ScreencastBrowserSelector}
          className={cls(className || ``, `gb-browser`)}
        />
        {((forceShowLoading || loading))
          && (
            <BrowserLoading
              speed={800}
              loading={loading}
              start={loadingFadeout}
              styles={loadingStyles}
              forced={forceShowLoading}
              {...loadingProps}
            />
          )}
      </BrowserViewContainer>
    </BrowserContainer>
  )
}

export const Browser = forwardRef(BrowserComp)
