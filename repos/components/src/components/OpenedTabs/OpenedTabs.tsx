import type { TOpenedTabs  } from '../../types'

import { Tab as GBTab } from './Tab'
import {
  OpenTabsMain,
  OpenTabsContainer
} from './OpenedTabs.styled'


export const OpenedTabs = ({ openedTabs, Tab, ...rest }:TOpenedTabs) => {
  const TabComp = (Tab || GBTab) as typeof GBTab
  
  return (
    <OpenTabsContainer className='goblet-editor-opened-tab-wrapper'>
      <OpenTabsMain className='goblet-editor-opened-tab'>
        {openedTabs.map(tabItem => (
          <TabComp
            {...tabItem}
            {...rest}
            key={`opened-tab-${tabItem?.tab?.key || tabItem?.tab?.id || tabItem?.tab?.path}`}
          />
        ))}
      </OpenTabsMain>
    </OpenTabsContainer>
  )
}

