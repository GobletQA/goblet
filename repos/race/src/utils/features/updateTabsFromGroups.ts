import type { TRaceFeatures } from '@GBR/types'
import type { TTabItem } from '@gobletqa/components'

import { groupFindArr } from '@GBR/utils/features/groupFindArr'
import {get} from '@keg-hub/jsutils'

export const updateTabsFromGroups = (
  old:TRaceFeatures,
  groups:TRaceFeatures,
  tabs:TTabItem[]
) => {
  
  tabs.reduce((acc, tabItem) => {
    const { tab } = tabItem
    const loc = tab?.path as string
    if(!loc) return acc

    const item = get(groups, groupFindArr(loc))
    
    console.log(`------- tab -------`)
    console.log(tab)
    
    console.log(`------- item -------`)
    console.log(item)

    return acc
  }, [])
  
  console.log(`------- groups -------`)
  console.log(groups)
  console.log(`------- tabs -------`)
  console.log(tabs)
  
  return tabs
}