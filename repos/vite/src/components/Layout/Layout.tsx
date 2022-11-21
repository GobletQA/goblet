import type { ComponentProps, ReactNode } from 'react'

import 'react-page-split/style.css'
import { dims } from '@theme'
import { Divider } from './Divider'
import Container from '@mui/material/Container'
import { Terminal } from '@components/Terminal'
import { LayoutContainer } from './Divider.styled'
import { Screencast } from '@components/Screencast'
import { useLayoutResize } from '@hooks/components/useLayoutResize'
import {
  Proportional,
  VerticalPageSplit,
  HorizontalPageSplit,
} from 'react-page-split'

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

const fullHeight = {
  overflow: `hidden`,
  height: `calc( 100vh - ${dims.header.hpx} )`,
}
const noOverflow = {
  ...fullHeight,
  overflow: `hidden`
}

export type TLayout = {
  children: ReactNode
}

export const Layout = (props:TLayout) => { 
  const [ref, onResizeMove] = useLayoutResize()

  return (
    <LayoutContainer ref={ref} className='layout-container'>
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


