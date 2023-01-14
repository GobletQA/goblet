import type { ComponentProps, ReactNode } from 'react'

import 'react-page-split/style.css'
import { Divider } from './Divider'
import { Container } from './Layout.styled'
import { dims } from '@gobletqa/components/theme'
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
  position: `relative`,
  height: `calc( 100vh - ${dims.defs.header.hpx} )`,
}
const noOverflow = {
  ...fullHeight,
  overflow: `hidden`,
}

export type TLayout = {
  children: ReactNode
}

export const Layout = (props:TLayout) => { 
  const [ref, onHorResizeMove, onVerResizeMove] = useLayoutResize()

  return (
    <LayoutContainer ref={ref} className='layout-container'>
      <HorizontalPageSplit
        divider={Divider}
        resize={Proportional}
        widths={['40%', '60%']}
        onResizeMove={onHorResizeMove}
      >
        <Container
          disableGutters
          sx={noOverflow}
        >
          {props.children}
        </Container>
        <Container disableGutters sx={fullHeight}>
          <VerticalPageSplit
            onResizeMove={onVerResizeMove}
            divider={(props:ComponentProps<typeof Divider>) => (<Divider {...props} vertical />)}
          >
            <Screencast />
          </VerticalPageSplit>
        </Container>
      </HorizontalPageSplit>
    </LayoutContainer>
  )
}


