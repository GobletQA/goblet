import type { ReactNode } from 'react'
import type { TSettingGroupMeta, TSetting, TSettingsConfig } from '@types'

import { Fragment } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { SettingsListRow } from './SettingsListRow'
import { SettingsListItem } from './SettingsListItem'

export type TSettingBody = {
  keys: string[]
  items: TSetting[]
  width: number|boolean
  config: TSettingsConfig
}

export const SettingsListBody = (props:TSettingBody) => {
  const { width, keys, items, config } = props

  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={2}
      sx={{
        padding: 2,
        paddingLeft: 0,
        paddingBottom: 0,
      }}
      disableEqualOverflow={true}
      className='settings-list-body'
    >
      {
        items.map((item) => {
          return (
            <Fragment key={item.key} >
              <SettingsListRow>
                {
                  keys.reduce((acc, key, idx) => {
                    if(config.hiddenKeys.includes(key)) return acc
                    
                    const align = idx ? `right` : `left`
                    const value = item[key as keyof typeof item]

                    acc.push(
                      <SettingsListItem
                        key={`${item.key}-${key}`}
                        item={item}
                        colKey={key}
                        width={width}
                        align={align}
                        value={value}
                        config={config}
                        className='settings-list-body-item'
                      />
                    )
                    return acc
                  }, [] as ReactNode[])
                }
              </SettingsListRow>
              <Divider
                className={`${item.key}-divider`}
                sx={{
                  width: `100%`,
                  display: `flex`,
                  paddingTop: `3px`
                }}
              />
            </Fragment>
          )
        })
      }
    </Grid>
  )
}
