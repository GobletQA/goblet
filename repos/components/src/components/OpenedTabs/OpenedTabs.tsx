import type { TOpenedTabs  } from '../../types'

import { Tab as GBTab } from './Tab'
import {
  OpenTabsMain,
  OpenTabsContainer,
  OpenTabsBottomBorder
} from './OpenedTabs.styled'


export const OpenedTabs = ({ openedTabs, Tab, activeTab, ...rest }:TOpenedTabs) => {
  const TabComp = (Tab || GBTab) as typeof GBTab

  return (
    <OpenTabsContainer className='goblet-editor-opened-tab-wrapper'>
      <OpenTabsMain className='goblet-editor-opened-tab'>
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

