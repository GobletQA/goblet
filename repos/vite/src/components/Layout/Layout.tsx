import type { ReactNode } from 'react'

import "allotment/dist/style.css"
import { Allotment } from "allotment"
import { LayoutCover } from './LayoutCover'
import { ActionBar } from '@gobletqa/components'
import { BrowserActions } from '../BrowserActions'
import { Screencast } from '@components/Screencast'
import {useLayoutResize} from '@hooks/components/useLayoutResize'
import {
  LContainer,
  RContainer,
  RTSection,
  LayoutContainer,
} from './Layout.styled'

const styles = {
  container: {
    height: `100%`,
    overflow: `hidden`,
  }
}

export type TLayout = {
  children: ReactNode
}

export const Layout = (props:TLayout) => { 
  const { onDragEnd  } = useLayoutResize()

  return (
    <LayoutContainer
      className='gb-layout-container'
    >
      <Allotment
        onDragEnd={onDragEnd}
      >

        <Allotment.Pane preferredSize={`40%`} >
          <LContainer
            disableGutters
            sx={styles.container}
            className='gb-layout-left-container gb-container-editor'
          >
            {props.children}
            <LayoutCover />
          </LContainer>
        </Allotment.Pane>

        <Allotment.Pane preferredSize={`60%`} >
          <RContainer
            disableGutters
            sx={styles.container}
            className='gb-layout-right-container gb-container-browser'
          >
            <RTSection className='gb-layout-right-top-section' >
              <ActionBar actions={BrowserActions} />
            </RTSection>

            <Screencast />
          </RContainer>
        </Allotment.Pane>

      </Allotment>
    </LayoutContainer>
  )
}


