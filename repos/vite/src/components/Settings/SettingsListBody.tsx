import type { ReactNode } from 'react'
import type { TSetting, TSettingsConfig } from '@types'

import { Fragment } from 'react'
import { exists } from '@keg-hub/jsutils'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
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
          const resetDisabled = !item?.active || item.value === item.default

          // If display is not defined, or it's set to true
          return !exists<boolean>(item.display) || item.display === true
            ? (
                <Fragment key={item.key} >
                  <SettingsListRow>
                    {
                      keys.reduce((acc, key, idx) => {
                        if(config.hiddenKeys.includes(key)) return acc
                        
                        const align = idx ? `right` : `left`
                        const value = item[key as keyof typeof item]

                        acc.push(
                          <SettingsListItem
                            item={item}
                            colKey={key}
                            width={width}
                            align={align}
                            value={value}
                            config={config}
                            key={`${item.key}-${key}`}
                            className='settings-list-body-item'
                          />
                        )
                        
                        if(idx === keys.length - 1)
                          acc.push(
                            <SettingsListItem
                              item={item}
                              key={`reset`}
                              width={width}
                              align={align}
                              value={`Reset`}
                              config={config}
                              colKey={`reset`}
                              className='settings-list-header-item'
                              disabled={resetDisabled}
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
            : null
        })
      }
    </Grid>
  )
}
