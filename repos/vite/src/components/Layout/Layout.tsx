import type { ComponentProps, ReactNode } from 'react'

import 'react-page-split/style.css'
import { Divider } from './Divider'

import Box from '@mui/material/Box'

import { EBrowserState } from '@types'
import { BrowserActions } from '../BrowserActions'
import { Screencast } from '@components/Screencast'
import { ActionBar, dims } from '@gobletqa/components'
import { useLayoutResize } from '@hooks/components/useLayoutResize'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  LContainer,
  RContainer,
  RTSection,
  LayoutContainer,
  LAutomationCover,
} from './Layout.styled'
import {
  Proportional,
  HorizontalPageSplit,
} from 'react-page-split'
import {cls} from '@keg-hub/jsutils'

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


const styles = {
  container: {
    overflow: `hidden`,
    height: `calc( 100vh - ${dims.defs.header.hpx} )`,
  }
}

export type TLayout = {
  children: ReactNode
}

export const Layout = (props:TLayout) => { 
  const [ref, onHorResizeMove] = useLayoutResize()

  const { browserState } = useBrowserState()
  const automationActive = (browserState !== EBrowserState.idle)

  return (
    <LayoutContainer
      ref={ref}
      className='layout-container'
    >
      <HorizontalPageSplit
        divider={Divider}
        resize={Proportional}
        widths={['40%', '60%']}
        onResizeMove={onHorResizeMove}
      >
        <LContainer
          disableGutters
          sx={styles.container}
          className='gb-layout-left-container gb-container-editor'
        >
          {props.children}
          <LAutomationCover
            className={cls(
              `gb-automation-cover`,
              automationActive && `active`
            )}
          />
        </LContainer>

        <RContainer
          disableGutters
          sx={styles.container}
          className='gb-layout-right-container gb-container-browser'
        >

          <Box
            flexDirection='column'
            className='react-page-split'
          >
            <RTSection className='gb-layout-right-top-section' >
              <ActionBar actions={BrowserActions} />
            </RTSection>

            <Screencast />
          </Box>
        </RContainer>
      </HorizontalPageSplit>
    </LayoutContainer>
  )
}


