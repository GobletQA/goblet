import type { ReactNode } from 'react'

import { EBrowserState } from '@types'
import { cls } from '@keg-hub/jsutils'
import { BrowserActions } from '../BrowserActions'
import { Screencast } from '@components/Screencast'
import { ActionBar, dims } from '@gobletqa/components'
import { useBrowserState } from '@hooks/screencast/useBrowserState'
import {
  LContainer,
  RContainer,
  RTSection,
  LayoutContainer,
  LAutomationCover,
} from './Layout.styled'


import "allotment/dist/style.css"
import { Allotment } from "allotment"


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
  const { browserState } = useBrowserState()
  const automationActive = (browserState !== EBrowserState.idle)

  return (
    <LayoutContainer
      className='gb-layout-container'
    >
      <Allotment>

        <Allotment.Pane preferredSize={`40%`} >
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


