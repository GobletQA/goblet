import type { TTabAction, TTabItem } from '@gobletqa/components'
import type {
  TFeaturesRef,
  TRaceFeature,
  TOnFeatureCB,
} from '@GBR/types'

import { useMemo, useState } from 'react'
import { useInline } from '@gobletqa/components'
import { EmptyFeatureUUID } from '@GBR/constants'
import { setTabActive, featureToTab } from '@GBR/utils/features/featureTabs'

export type THInitTabs = {
  feature?:TRaceFeature
}

export const useInitTabs = (props:THInitTabs) => {
  const {
    feature
  } = props
  
  const initialTabs = useMemo(() => {
    return feature?.uuid ? [featureToTab(feature, { active: true })] : []
  }, [])

  const [openedTabs, setOpenedTabs] = useState<TTabItem[]>(initialTabs)

  // There should only be one tab with an empty uuid
  // always filter out any existing tags with that uuid
  // The first call here, adds the tab with an empty uuid
  // The second call removes it and replaces it
  // With the updated feature that should now have a valid uuid
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