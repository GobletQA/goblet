import type { TSettingGroupMeta, TSetting, TSettingsConfig } from '@types'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { asCallback } from '@utils/helpers'
import { SettingsListBody } from './SettingsListBody'
import { SettingsListHeader } from './SettingsListHeader'
import { resetSetting } from '@actions/settings/resetSetting'

export type TSettingsList = {
  group: TSettingGroupMeta
  config: TSettingsConfig
}

export const SettingsList = (props:TSettingsList) => {
  const {
    group,
    config
  } = props

  const {
    keys,
    width,
    items
  } = useMemo(() => {
    return Object.entries(group.settings)
      .reduce((acc, [key, value]) => {
        if(!acc.keys?.length){
          acc.keys = Object.keys(value).filter(key => !config.hiddenKeys.includes(key))
          acc.width = Math.round(12 / acc.keys.length) - 1
        }

        acc.items.push({ ...value, onReset: asCallback(resetSetting, value, true) })

        return acc
      }, {
        keys: [] as string[],
        items: [] as TSetting[],
        width: true as number|boolean
      })
  }, [group.settings])

  return (
    <Box>
      <SettingsListHeader
        keys={keys}
        width={width}
        config={config}
        group={group.name}
      />
      <SettingsListBody
        keys={keys}
        width={width}
        items={items}
        config={config}
      />
    </Box>
  )
}