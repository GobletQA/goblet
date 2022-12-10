import type { ReactNode } from 'react'
import type { TSettingsConfig, TSetting } from '@types'

import { useMemo } from 'react'
import { wordCaps } from '@keg-hub/jsutils'
import Grid from '@mui/material/Unstable_Grid2'
import { ResetAllGroupSetting } from '@constants'
import { SettingsListRow } from './SettingsListRow'
import { SettingsListItem } from './SettingsListItem'
import { resetSetting } from '@actions/settings/resetSetting'

export type TSettingListHeader = {
  group:string
  keys: string[]
  width: number|boolean
  config: TSettingsConfig
}

export const SettingsListHeader = (props:TSettingListHeader) => {
  const { config, keys, width, group } = props

  const resetItem = useMemo(() => {
    const item:TSetting = {
      group,
      value: undefined,
      key: ResetAllGroupSetting,
    }
    item.onReset = () => resetSetting(item)

    return item
  }, [group])

  return (
    <Grid
      container
      spacing={2}
      sx={{
        paddingRight: 2,
        borderBottom: 1,
        paddingBottom: 0.5,
        borderColor: 'divider'
      }}
      disableEqualOverflow={true}
      className='settings-list-header'
    >
      <SettingsListRow>
        {keys?.length && (
          keys.reduce((acc, key, idx) => {
            if(config.hiddenKeys.includes(key)) return acc
            
            const align = idx ? `right` : `left`
            
            acc.push(
              <SettingsListItem
                header
                key={key}
                colKey={key}
                width={width}
                align={align}
                config={config}
                sx={{ fontWeight: `bold` }}
                className='settings-list-header-item'
                value={key === `key` ? `Name` : wordCaps(key)}
              />
            )
            
            if(idx === keys.length - 1)
              acc.push(
                <SettingsListItem
                  header
                  key={`reset`}
                  colKey={`reset`}
                  width={width}
                  align={align}
                  config={config}
                  item={resetItem}
                  className='settings-list-header-item'
                  value={`Reset All`}
                />
              )

            return acc
          }, [] as ReactNode[])
        )}
      </SettingsListRow>
    </Grid>
  )
}
