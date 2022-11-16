import type { CSSProperties } from 'react'

import { Browser } from '@components/Browser'
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
      onConnect={onConnect}
      onKeyDown={onKeyDown}
      forceShowLoading={true}
      onClipboard={onClipboard}
      loadingFadeout={fadeStart}
      onDisconnect={onDisconnect}
      className='screencast-browser'
    />
  )
}