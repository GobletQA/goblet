import type { ComponentType } from 'react'
import type { TTabItem, TTab } from '@gobletqa/components'
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
 * Removes a from from the passed in array of tabItems
 */
export const removeTab = (tabs:TTabItem[], tab:TTab) => {

  let nextActive:TTabItem | undefined

  const updated = tabs.reduce((updated, tabItem, idx) => {
    isTabMatch(tabItem, tab)
      ? (nextActive = setNextActive(updated, idx))
      : updated.push(tabItem)

    return updated
  }, [] as TTabItem[])

  return { tabs: updated, active: nextActive || updated[0] }
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
  tab: {...feature, ...tab}
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