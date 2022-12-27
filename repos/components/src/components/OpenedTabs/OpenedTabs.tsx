import type { TOpenedTabs  } from '../../types'
import './OpenedTabs.css'

import { Tab } from './Tab'
import {
  OpenTabsMain,
  OpenTabsContainer
} from './OpenedTabs.styled'


export const OpenedTabs = ({ openedTabs, ...rest }:TOpenedTabs) => {
  return (
    <OpenTabsContainer className='goblet-editor-opened-tab-wrapper'>
      <OpenTabsMain className='goblet-editor-opened-tab'>
        {openedTabs.map(tabItem => (
          <Tab
            {...tabItem}
            {...rest}
            key={`opened-tab-${tabItem?.tab?.key || tabItem?.tab?.id || tabItem?.tab?.path}`}
          />
        ))}
      </OpenTabsMain>
    </OpenTabsContainer>
  )
}

