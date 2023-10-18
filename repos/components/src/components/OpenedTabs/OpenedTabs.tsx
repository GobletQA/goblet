import type { TOpenedTabs  } from '../../types'

import { Tab as GBTab } from './Tab'
import {useScrollHor} from '@GBC/hooks/dom/useScrollHor'
import {
  OpenTabsMain,
  OpenTabsContainer,
} from './OpenedTabs.styled'
import {TabScrollParentCls} from '@GBC/constants/values'



export const OpenedTabs = ({ openedTabs, Tab, activeTab, ...rest }:TOpenedTabs) => {
  const TabComp = (Tab || GBTab) as typeof GBTab
  const { scrollRef } = useScrollHor()

  /**
   * **IMPORTANT** - If the scroll ref or the TabScrollParentCls class is changed to a different element
   * The `utils/components/scrollToTab` must be updated to match the changes
   * Otherwise scrolling will break
   */
  return (
    <OpenTabsContainer
      ref={scrollRef}
      className={`gb-editor-opened-tabs-container ${TabScrollParentCls}`}
    >
      <OpenTabsMain className={`gb-editor-opened-tabs-main`}>

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

