import type { ComponentProps, ReactNode } from 'react'

import 'react-page-split/style.css'
import { Divider } from './Divider'

import { BrowserActions } from '../BrowserActions'
import { Screencast } from '@components/Screencast'
import { ActionBar, dims } from '@gobletqa/components'
import { useLayoutResize } from '@hooks/components/useLayoutResize'
import {
  LContainer,
  RContainer,
  RTSection,
  RMSection,
  LayoutContainer,
} from './Layout.styled'
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
  const [ref, onHorResizeMove] = useLayoutResize()

  return (
    <LayoutContainer ref={ref} className='layout-container'>
      <HorizontalPageSplit
        divider={Divider}
        resize={Proportional}
        widths={['50%', '50%']}
        onResizeMove={onHorResizeMove}
      >
        <LContainer
          disableGutters
          sx={noOverflow}
        >
          {props.children}
        </LContainer>

        <RContainer
          sx={fullHeight}
          disableGutters
          className={`gb-layout-right-container`}
        >

          <VerticalPageSplit
            heights={[`35px`, `auto`]}
            divider={() => <span /> as any}
          >

            <RTSection className='gb-layout-right-top-section' >
              <ActionBar actions={BrowserActions} />
            </RTSection>

            <Screencast />
          </VerticalPageSplit>

        </RContainer>
      </HorizontalPageSplit>
    </LayoutContainer>
  )
}


