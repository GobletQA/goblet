import type { TOpenedTabs  } from '../../types'

import { Tab as GBTab } from './Tab'
import {useScrollHor} from '@GBC/hooks/dom/useScrollHor'
import {
  OpenTabsMain,
  OpenTabsContainer,
  OpenTabsBottomBorder
} from './OpenedTabs.styled'
import {TabScrollParentCls} from '@GBC/constants/values'



export const OpenedTabs = ({ openedTabs, Tab, activeTab, ...rest }:TOpenedTabs) => {
  const TabComp = (Tab || GBTab) as typeof GBTab
  const { scrollRef } = useScrollHor()

  return (
    <OpenTabsContainer className='gb-editor-opened-tab-wrapper'>
      <OpenTabsMain ref={scrollRef} className={`gb-editor-opened-tab ${TabScrollParentCls}`}>
        <OpenTabsBottomBorder />

        {openedTabs?.map(tabItem => {
          const ref = tabItem?.tab?.uuid || tabItem?.tab?.path

          return (
            <TabComp
              {...tabItem}
              {...rest}
              key={`opened-tab-${ref}`}
              active={activeTab === ref}
            />
          )
        })}

      </OpenTabsMain>
    </OpenTabsContainer>
  )
}

