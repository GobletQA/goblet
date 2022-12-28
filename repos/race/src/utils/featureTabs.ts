import type { ComponentType } from 'react'
import type { TTabItem, TTab } from '../goblet'
import type { TRaceFeature, TRaceFeatures } from '../types'

import BoltIcon from '@mui/icons-material/Bolt'
import { noOpObj, omitKeys } from '@keg-hub/jsutils'
import { TabStyles, TabRefs } from '../constants/tabs'

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
const isTabMatch = (tabItem:TTabItem, tab:TTab) => {
  return TabRefs.reduce((found, ref) => {
    return found || tabItem.tab[ref] === tab[ref]
  }, false)
}

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
  return ensureTabOpened(tabs, tab).reduce((tabs, tabItem) => {

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
 * Removes a from from the passed in array of tabItems
 */
export const removeTab = (tabs:TTabItem[], tab:TTab) => {
  return tabs.reduce((tabs, tabItem) => {
    !isTabMatch(tabItem, tab) && tabs.push(tabItem)

    return tabs
  }, [] as TTabItem[])
}

/**
 * Converts a feature object into a tab object for the tabs component
 */
export const featureToTab = (
  feature:TRaceFeature,
  { Icon=BoltIcon, ...tab }:Partial<TTab> & { Icon?:ComponentType<any> }=noOpObj
):TTabItem => ({
  Icon,
  styles: TabStyles,
  tab: {
    ...feature,
    ...tab,
    uuid: `${feature?.parent?.uuid}-${feature.uuid}`,
  },
})

/**
 * Converts a tab object into a feature object
 */
export const featureFromTab = (tab:TTab, features:TRaceFeatures) => {
  // This seems to break tab switching, doesn't make a lot of sense?
  // const feat = features[tab?.uuid as keyof typeof features]
  // return feat

  const omitFeat = omitKeys<TRaceFeature>(tab, [`active`, `editing`])
  return omitFeat
}