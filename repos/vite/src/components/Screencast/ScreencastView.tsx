import type { CSSProperties } from 'react'

import { Browser } from '@components/Browser'
import { useColor } from '@hooks/theme/useColor'
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

  const background = useColor(`colors.white`, `colors.black15`)

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
      background={background}
      onClipboard={onClipboard}
      loadingFadeout={fadeStart}
      onDisconnect={onDisconnect}
      className={ScreencastBrowserSelector}
    />
  )
}