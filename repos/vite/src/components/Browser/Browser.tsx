import type { ForwardRefRenderFunction } from 'react'
import type { TBrowserProps, TBrowserHandle } from '@types'


import { forwardRef, useImperativeHandle } from 'react'

import { cls } from '@keg-hub/jsutils'
import { BrowserNav } from './BrowserNav'
import { BrowserCover } from './BrowserCover'
import { BrowserLoading } from './BrowserLoading'
import { ScreencastBrowserSelector } from '@constants'
import { useVncRefs } from '@hooks/screencast/useVncRefs'
import { useRFBHooks } from '@hooks/screencast/useRFBHooks'
import { useVncSetup } from '@hooks/screencast/useVncSetup'
import { useVncHandlers } from '@hooks/screencast/useVncHandlers'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  BrowserView,
  BrowserContainer,
  BrowserShadowTop,
  BrowserShadowBottom,
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

const BrowserComp: ForwardRefRenderFunction<TBrowserHandle, TBrowserProps> = (props, ref) => {

  const {
    style,
    isLoaded,
    displayUrl,
    elementAttrs,
    loadingProps,
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
  } = useVncSetup(props, {
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

  const {
    browserState,
    setBrowserState
  } = useBrowserState()

  return (
    <BrowserContainer className={cls('gb-browser-container', browserState)}>
      <BrowserNav
        rfbRef={rfb}
        loading={loading}
        initialUrl={displayUrl}
      />
      <BrowserViewContainer className='gb-browser-view-container'>
        <BrowserView
          style={style}
          {...elementAttrs}
          ref={onScreenNode}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          id={ScreencastBrowserSelector}
          className={cls(ScreencastBrowserSelector, `gb-browser`)}
        />
        
        <BrowserLoading
          speed={800}
          fadeOut={isLoaded}
          styles={loadingStyles}
          {...loadingProps}
        />

      </BrowserViewContainer>
      <BrowserCover
        browserState={browserState}
        setBrowserState={setBrowserState}
      />
      <BrowserShadowTop className={cls('gb-browser-top-shadow', browserState)} />
      <BrowserShadowBottom className={cls('gb-browser-top-shadow', browserState)} />
    </BrowserContainer>
  )
}

export const Browser = forwardRef(BrowserComp)
