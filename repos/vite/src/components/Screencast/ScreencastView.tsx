import type { CSSProperties } from 'react'

import { colors } from '@theme'
import { Browser } from '@components/Browser'
import { ScreencastBrowserSelector } from '@constants'
import { useScreencastHooks } from '@hooks/screencast/useScreencastHooks'

export type TScreencastViewProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const ScreencastView = (props:TScreencastViewProps) => {
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
      onConnect={onConnect}
      onKeyDown={onKeyDown}
      forceShowLoading={true}
      onClipboard={onClipboard}
      loadingFadeout={fadeStart}
      background={colors.black03}
      onDisconnect={onDisconnect}
      className={ScreencastBrowserSelector}
    />
  )
}