import type { ReactNode } from 'react'
import type { TSettingGroupMeta, TSetting, TSettingsConfig } from '@types'

import { wordCaps } from '@keg-hub/jsutils'
import Grid from '@mui/material/Unstable_Grid2'
import { SettingsListRow } from './SettingsListRow'
import { SettingsListItem } from './SettingsListItem'

export type TSettingListHeader = {
  keys: string[]
  width: number|boolean
  config: TSettingsConfig
}

export const SettingsListHeader = (props:TSettingListHeader) => {
  const { config, keys, width } = props

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

            return acc
          }, [] as ReactNode[])
        )}
      </SettingsListRow>
    </Grid>
  )
}
