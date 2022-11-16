import type { ComponentProps, ReactNode } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { toNum } from '@keg-hub/jsutils'
import { useCallback, useRef, useEffect } from 'react'
import { ScreencastWidth, ScreencastHeight } from '@constants'

import { dims } from '@theme'
import { Divider } from './Divider'
import { Browser } from '@components/Browser'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { LayoutContainer } from './Divider.styled'
import { Screencast } from '@components/Screencast'
import {
  Proportional,
  VerticalPageSplit,
  HorizontalPageSplit,
} from 'react-page-split'
import 'react-page-split/style.css'

export type TScreenDimsFull = {
  width: number
  ratio: number
  height: number
}

export type TScreenDims = Omit<TScreenDimsFull, 'ratio'> & {
  ratio?: number
}

export type TScreenDimsOpts = {
  width?: number
  ratio?: number
  height?: number
}

const defSize:TScreenDimsFull = {
  width: ScreencastWidth,
  height: ScreencastHeight,
  ratio: Math.round(((ScreencastWidth / ScreencastHeight) + Number.EPSILON) * 100) / 100,
}

const fullHeight = {
  height: `calc( 100vh - ${dims.header.height + dims.footer.height}px)`,
  overflow: `hidden`
}
const noOverflow = {
  ...fullHeight,
  overflow: `hidden`
}

export type TLayout = {
  children: ReactNode
}

const getChildPanels = (parentEl:HTMLDivElement) => {
  const found = parentEl?.querySelector?.(`.react-page-split`)
  return ([
    ...(found?.childNodes || [])
  ] as HTMLDivElement[]).filter(el => el.tagName === `DIV`)
}

export const Layout = (props:TLayout) => {
  
  const resizeNumRef = useRef<number>(0)
  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  
  const onResizeMove = useCallback((event:ResizeMoveEvent) => {
    if(!resizeNumRef.current) return resizeNumRef.current = event.to
    
    const lVPanel = lVPanelRef.current
    const rVPanel = rVPanelRef.current

    if(!rVPanel || !lVPanel)
      return console.warn(`Vertical Panel Refs not set`, lVPanel, rVPanel)

    const lWidth = toNum(lVPanel.offsetWidth)
    const lHeight = toNum(lVPanel.style.flexBasis || lVPanel.offsetHeight)
    const rHeight = toNum(rVPanel.style.flexBasis || rVPanel.offsetHeight)

    const lRatio = lWidth > lHeight ? (lWidth / defSize.ratio) : (lHeight / defSize.ratio)

    if(resizeNumRef.current > event.to){
      // The left panel is getting smaller in width
      // So make the right top vertical panel taller in height
      const diff = resizeNumRef.current - event.to
      const adjust = (lHeight + diff) / lRatio
      lVPanel.style.flexBasis = `${lHeight + diff}px`
      rVPanel.style.flexBasis = `${rHeight - adjust}px`
    }
    else if(resizeNumRef.current < event.to) {
      // The left panel is getting greater in width
      // So make the right top vertical panel shorter in height
      const diff = event.to - resizeNumRef.current
      const adjust = (lHeight + diff) / lRatio
      lVPanel.style.flexBasis = `${lHeight - diff}px`
      rVPanel.style.flexBasis = `${rHeight + adjust}px`
    }


    resizeNumRef.current = event.to
  }, [])
  
  useEffect(() => {
    if(!parentElRef.current) return

    const [__, rHPanel] = getChildPanels(parentElRef.current)
    if(!rHPanel) return console.warn(`Could not find Right Horizontal Panel`)

    const [lVPanel, rVPanel] = getChildPanels(rHPanel)
    if(!rVPanel) return console.warn(`Could not find Right Vertical Panel`)

    lVPanel.style.overflow = `hidden`
    rVPanel.style.overflow = `hidden`
    lVPanelRef.current = lVPanel
    rVPanelRef.current = rVPanel

  }, [])
  
  return (
    <LayoutContainer
      ref={parentElRef}
      className='layout-container'
    >
      <HorizontalPageSplit
        divider={Divider}
        resize={Proportional}
        onResizeMove={onResizeMove}
      >
        <Container disableGutters sx={noOverflow}>
          {props.children}
        </Container>
        <Container disableGutters sx={fullHeight}>
          <VerticalPageSplit
            divider={(props:ComponentProps<typeof Divider>) => (<Divider {...props} vertical />)}
          >
            <Screencast />
            <Terminal />
          </VerticalPageSplit>
        </Container>
      </HorizontalPageSplit>
    </LayoutContainer>
  )
}


