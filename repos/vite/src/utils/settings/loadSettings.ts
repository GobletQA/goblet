import type { TSettings, TSettingGroup, TSetting } from '@types'

import { getStore } from '@store'
import { localStorage } from '@services/localStorage'
import { deepMerge, set, get } from '@keg-hub/jsutils'

export const loadSettings = async (settings?:TSettings) => {

  const storageSettings = await localStorage.getSettings()
  const settingState = settings || getStore().getState().settings

  return Object.entries(storageSettings)
    .reduce((acc, [loc, data]) => {
      const [group, name] = loc.split(`.`) as [keyof typeof acc, string]
      if(!group || !name) return acc

      // TODO: figure out why this type is jacked
      // @ts-ignore
      acc[group] = {
        ...acc[group],
        [name]: {
          ...get<TSetting>(settingState, loc),
          ...data,
        } as TSetting
      } as TSettingGroup

      return acc
    }, deepMerge<TSettings>(settingState))
}