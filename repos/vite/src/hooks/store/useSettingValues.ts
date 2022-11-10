import type { TValueGroup } from '@types'

import { useMemo } from 'react'
import { useSettings } from '@store'
import { getSettingsValues } from '@utils/store/getSettingsValues'

/**
 * Helper to extract the values from a settings object and match it to the key
 * Creates a key value pair removing the meta-data
 */
export const useSettingValues = <T extends TValueGroup>(loc:string):T => {
  const settings = useSettings()
  return useMemo(() => getSettingsValues(loc, settings), [loc, settings])
}