import type { CSSProperties } from 'react'

import { Browser } from '@components/Browser'
import { ScreencastBrowserSelector } from '@constants'
import { useScreencastHooks } from '@hooks/screencast/useScreencastHooks'

export type TScreencastProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const Screencast = (props:TScreencastProps) => {
  const {
    vncRef,
    repoUrl,
    fadeStart,
    onConnect,
    onKeyDown,
    onClipboard,
    onDisconnect,
    screencastUrl,
  } = useScreencastHooks()

  return (
    <Browser
      ref={vncRef}
      url={screencastUrl}
      autoConnect={false}
      scaleViewport={true}
      displayUrl={repoUrl}
      background='#262931'
      onConnect={onConnect}
      onKeyDown={onKeyDown}
      forceShowLoading={true}
      onClipboard={onClipboard}
      loadingFadeout={fadeStart}
      onDisconnect={onDisconnect}
      className={ScreencastBrowserSelector}
    />
  )
}