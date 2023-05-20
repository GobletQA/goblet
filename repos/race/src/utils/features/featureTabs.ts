import type { ComponentType } from 'react'
import type { TTabItem, TTab } from '@gobletqa/components'
import type { TRaceFeature, TRaceFeatures } from '@GBR/types'

import { BoltIcon } from '@gobletqa/components'
import { noOpObj, omitKeys } from '@keg-hub/jsutils'
import { TabStyles, TabRefs } from '@GBR/constants/tabs'
import { EmptyFeatureUUID } from '@GBR/constants/values'
import { featureFromLoc } from '@GBR/utils/features/featureFromLoc'

/**
 * Updates a tab with the passed in update object
 */
const updateTabProps = (tabItem:TTabItem, update: Partial<TTab>) => ({
  ...tabItem,
  tab: {
    ...tabItem.tab,
    ...update
  }
})

/**
 * Check if a tabItems matches a tab object
 */
export const isTabMatch = (tabItem:TTabItem, tab:TTab) => {
  return TabRefs.reduce((found, ref) => {
    return found || tabItem.tab[ref] === tab[ref]
  }, false)
}

/**
 * Checks if the passed in tab is already in the opened tabs
 * If not, then creates it from the feature and adds it to the opened tabs
 */
const ensureTabOpened = (tabs:TTabItem[], tab:TTab) => {
  const found = tabs.find(tabItem => isTabMatch(tabItem, tab))
  return found
    ? tabs
    : [...tabs, featureToTab(tab as TRaceFeature)]
}

/**
 * Sets the passed in tab active
 * Switches any existing active tabs to false
 */
export const setTabActive = (tabs:TTabItem[], tab:TTab) => {
  return ensureTabOpened(tabs, tab)
    .reduce((tabs, tabItem) => {

      const makeActive = isTabMatch(tabItem, tab)

      const addTab = makeActive
        ? updateTabProps(tabItem, {active: true})
        : tabItem?.tab?.active
          ? updateTabProps(tabItem, {active: false})
          : tabItem

      tabs.push(addTab)

      return tabs
    }, [] as TTabItem[])
}

/**
 * Finds the next active tab when a different tab is closed
 * When more then on feature is open, or undefined
 */
const setNextActive = (tabs:TTabItem[], idx:number) => {
  const nextActiveIdx = idx > 0 ? idx - 1 : 0
  if(!tabs[nextActiveIdx]) return

  tabs[nextActiveIdx] = updateTabProps(tabs[nextActiveIdx], {active: true})

  return tabs[nextActiveIdx]
}

/**
 * Removes a tab from the passed in array of tabItems
 * If the tab was active, will set the previous tab active instead
 * Uses the index of the removed tab to find the previous tab
 * Defaults to setting the first tab to active if the previous tab can not be found
 * If no tabs are left after removal, then the active tab is returned as undefined
 */
export const removeTab = (tabs:TTabItem[], tab:TTab) => {

  let rmIdx:number=0
  const removed = tabs.reduce((updated, tabItem, idx) => {
    isTabMatch(tabItem, tab) ? (rmIdx = idx) : updated.push(tabItem)

    return updated
  }, [] as TTabItem[])

  const active = tab.active
    ? setNextActive(removed, rmIdx) || removed[0]
    : removed.find(item => item.tab.active) || removed[0]

  return {active, tabs: removed}
}

/**
 * Converts a feature object into a tab object for the tabs component
 * Sets defaults that can be overwritten
 */
export const featureToTab = (
  feature:TRaceFeature,
  { Icon=BoltIcon, ...tab }:Partial<TTab> & { Icon?:ComponentType<any> }=noOpObj,
):TTabItem => ({
  Icon,
  styles: TabStyles,
  tab: {
    ...feature,
    ...tab,
    title: feature.uuid === EmptyFeatureUUID
      ? `New Feature`
      : feature.path || feature.feature
  }
})


/**
 * Uses the uuid to find an existing feature
 * If not found, then converts a tab object into a feature object
 */
export const featureFromTab = (tab:TTab, features:TRaceFeatures) => {
  const feat = featureFromLoc({
    features,
    loc: tab.path as string,
  })

  if(feat && feat.type !== `folder`) return feat

  return omitKeys<TRaceFeature>(tab, [`active`, `editing`, `title`])
}