import type { MutableRefObject, ReactNode } from 'react'
import type { TGobletSettings } from '@types'
import type { AllotmentHandle } from "allotment"

import "allotment/dist/style.css"
import { LayoutCover } from './LayoutCover'
import { ActionBar } from '@gobletqa/components'
import { BrowserActions } from '../BrowserActions'
import { Screencast } from '@components/Screencast'
import { useRef, useEffect, useState } from 'react'
import { LayoutPriority, Allotment } from "allotment"
import {useLayoutResize} from '@hooks/components/useLayoutResize'
import {useSettingValues} from '@hooks/settings/useSettingValues'
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
  const allRef = useRef<AllotmentHandle>()

  const { browserInBrowser } = useSettingValues<TGobletSettings>(`goblet`)
  const [showBrowser, setShowBrowser] = useState<boolean>(browserInBrowser)

  useEffect(() => {
    if(!allRef.current) return

    if((!browserInBrowser && showBrowser)){
      setShowBrowser(false)
      allRef.current.reset()
    }
    else if((browserInBrowser && !showBrowser)){
      setShowBrowser(true)
      allRef.current.reset()
    }

  }, [
    showBrowser,
    browserInBrowser
  ])

  return (
    <LayoutContainer
      className='gb-layout-container'
    >
      <Allotment
        onDragEnd={onDragEnd}
        ref={allRef as MutableRefObject<AllotmentHandle>}
      >

        <Allotment.Pane
          preferredSize={`40%`}
          priority={LayoutPriority.Low}
        >
          <LContainer
            disableGutters
            sx={styles.container}
            className='gb-layout-left-container gb-container-editor'
          >
            {props.children}
            <LayoutCover showBrowser={showBrowser} />
          </LContainer>
        </Allotment.Pane>

        <Allotment.Pane
          preferredSize={`60%`}
          visible={showBrowser}
          priority={LayoutPriority.High}
        >
          <RContainer
            disableGutters
            sx={styles.container}
            className='gb-layout-right-container gb-container-browser'
          >
            <RTSection className='gb-layout-right-top-section' >
              <ActionBar actions={BrowserActions} />
            </RTSection>

            <Screencast
              onDragEnd={onDragEnd}
              browserIsActive={showBrowser}
            />
          </RContainer>
        </Allotment.Pane>

      </Allotment>
    </LayoutContainer>
  )
}


