import type { CSSProperties } from 'react'

import { Browser } from '@components/Browser'
import { useColor } from '@hooks/theme/useColor'
import { DebuggerSlider } from '@components/Debugger'
import { LayoutPriority, Allotment } from "allotment"
import { useScreencastHooks } from '@hooks/screencast/useScreencastHooks'

export type TScreencastViewProps = {
  sx?: CSSProperties
  sSx?: CSSProperties
  onDragEnd?:() => void
}

export const ScreencastView = (props:TScreencastViewProps) => {
  
  const {
    onDragEnd
  } = props
  
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
    <Allotment
      vertical={true}
      onDragEnd={onDragEnd}
    >
      <Allotment.Pane
        preferredSize={`70%`}
        priority={LayoutPriority.Low}
      >
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
      </Allotment.Pane>
      <Allotment.Pane
        preferredSize={`30%`}
        priority={LayoutPriority.Low}
      >
        <DebuggerSlider />
      </Allotment.Pane>
    </Allotment>
  )
}