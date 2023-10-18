import type { TRaceFeatureAsts, TRaceFeature, TOpenedFeatures } from '@GBR/types'
import type { TTabItem } from '@gobletqa/components'

import { useMemo, useState } from 'react'
import { eitherArr } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { EmptyFeatureUUID } from '@GBR/constants'
import { setTabActive, featureToTab } from '@GBR/utils/features/featureTabs'

export type THInitTabs = {
  features?:TRaceFeatureAsts
  openedFeatures?:TOpenedFeatures
}

export const useInitTabs = (props:THInitTabs) => {
  const {
    features,
    openedFeatures
  } = props
  
  const initialTabs = useMemo(() => {
    if(!openedFeatures?.length || !features) return []

    return openedFeatures.reduce((acc, loc, idx) => {
      const feat = features[loc]
      feat && acc.push(featureToTab(feat, { active: !idx }))

      return acc
    }, [] as TTabItem[])
  }, [])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

  /**
   * There should only be one tab with an empty uuid
   * always filter out any existing tags with that uuid
   * The first call here, adds the tab with an empty uuid
   * The second call removes it and replaces it
   * With the updated feature that should now have a valid uuid
   */
  const updateEmptyTab = useInline((updated:TRaceFeature) => {
    const cleaned = openedTabs.filter(tab => tab.tab.uuid !== EmptyFeatureUUID)
    const updatedTabs = setTabActive(cleaned, updated)

    setOpenedTabs(updatedTabs)
  })

  return {
    openedTabs,
    setOpenedTabs,
    updateEmptyTab
  }

}
