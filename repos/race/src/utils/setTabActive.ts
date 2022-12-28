import type { TTabItem, TTab } from '../goblet'

type KeyOfTab = keyof TTab
const refs:KeyOfTab[] = [`uuid`, `id`, `key`] 

const toggleActive = (tabItem:TTabItem, active:boolean) => ({
  ...tabItem,
  tab: {
    ...tabItem.tab,
    active
  }
})


export const setTabActive = (tabs:TTabItem[], tab:TTab) => {
  return tabs.reduce((tabs, tabItem) => {
    if(tabItem.tab.active)
      tabItem = toggleActive(tabItem, false)

    const makeActive = refs.reduce((found, ref) => {
      return found || tabItem.tab[ref] === tab[ref]
    }, false)
  
    if(makeActive) tabItem = toggleActive(tabItem, true)

    tabs.push(tabItem)

    return tabs
  }, [] as TTabItem[])
}