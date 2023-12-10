import type { CSSProperties } from 'react'

import { Browser } from '@components/Browser'
import { DebuggerSlider } from '@components/Debugger'
import { useColor } from '@hooks/theme/useColor'
import { useScreencastHooks } from '@hooks/screencast/useScreencastHooks'

export type TScreencastViewProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
}

export const ScreencastView = (props:TScreencastViewProps) => {
  const {
    vncRef,
    repoUrl,
    isLoaded,
    onConnect,
    onKeyDown,
    onClipboard,
    onDisconnect,
    screencastUrl,
  } = useScreencastHooks()

  const background = useColor(`colors.white`, `colors.black15`)

  return (
    <>
      <Browser
        ref={vncRef}
        url={screencastUrl}
        autoConnect={false}
        isLoaded={isLoaded}
        scaleViewport={true}
        displayUrl={repoUrl}
        onConnect={onConnect}
        onKeyDown={onKeyDown}
        background={background}
        onClipboard={onClipboard}
        onDisconnect={onDisconnect}
      />
      <DebuggerSlider />
    </>
  )
}