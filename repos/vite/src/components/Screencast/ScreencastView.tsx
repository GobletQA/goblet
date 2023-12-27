import type { CSSProperties } from 'react'

import {useMemo } from 'react'
import { useApp } from '@store'
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
  const { inspector } = useApp()

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

  const background = useColor(`colors.gray01`, `colors.black19`)

  const sizes = useMemo(() => {
    return inspector
      ? {browser: `70%`, inspector: `30%`}
      : {browser: `100%`, inspector: `0%`}
  }, [inspector])

  return (
    <Allotment
      vertical={true}
      onDragEnd={onDragEnd}
    >
      <Allotment.Pane
        preferredSize={sizes.browser}
        priority={LayoutPriority.High}
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
    {inspector && (
      <Allotment.Pane
        priority={LayoutPriority.Low}
        preferredSize={sizes.inspector}
      >
        <DebuggerSlider
          onOpen={onDragEnd}
          onClose={onDragEnd}
        />
      </Allotment.Pane>
    )}
    </Allotment>
  )
}