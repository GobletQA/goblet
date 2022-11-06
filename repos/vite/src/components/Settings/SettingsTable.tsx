import type { ReactNode } from 'react'
import type { TSettingGroupMeta, TSetting } from '@types'

import { useMemo } from 'react'
import { wordCaps } from '@keg-hub/jsutils'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'

const hiddenKeys = [
  `group`,
]

export type TSettingsTable = {
  group: TSettingGroupMeta
}

type TSettingProps = {
  keys: string[]
  items: TSetting[]
  width: number|boolean
  group: TSettingGroupMeta
}

const SettingsListHeader = (props:TSettingProps) => {
  const { keys, width } = props

  return (
    <Grid
      container
      spacing={2}
      sx={{
        paddingRight: 2,
        paddingBottom: 0.5,
        borderBottom: 1,
        borderColor: 'divider'
      }}
      disableEqualOverflow={true}
      className='settings-list-header'
    >
      {keys?.length && (
        keys.reduce((acc, key, idx) => {
          if(hiddenKeys.includes(key)) return acc
          
          const align = idx ? `right` : `left`
          
          acc.push(
            <Grid
              key={key}
              xs={width}
              display='flex'
              sx={{ textAlign: align }}
              className='settings-list-header-item'
            >
              <Typography
                sx={{
                  width: `100%`,
                  textAlign: align,
                  fontWeight: `bold`,
                }}
              >
                {key === `key` ? `Name` : wordCaps(key)}
              </Typography>
            </Grid>
          )

          return acc
        }, [] as ReactNode[])
      )}
    </Grid>
  )
}

const SettingsListBody = (props:TSettingProps) => {
  const { width, keys, items } = props

  return (
    <Grid
      container
      rowSpacing={3}
      columnSpacing={2}
      sx={{
        padding: 2,
        paddingLeft: 0,
      }}
      disableEqualOverflow={true}
      className='settings-list-body'
    >
      {
        items.map((item) => {
          return keys.reduce((acc, key, idx) => {
            if(hiddenKeys.includes(key)) return acc
            
            const align = idx ? `right` : `left`
            
            const value = item[key as keyof typeof item]
            acc.push(
              <Grid
                xs={width}
                display='flex'
                key={`${item.key}-${key}`}
                className='settings-list-body-item'
              >
                <Typography
                  sx={{
                    width: `100%`,
                    textAlign: align
                  }}
                >
                  {`${value}`}
                </Typography>
              </Grid>
            )
            return acc
          }, [] as ReactNode[])
        })
      }
    </Grid>
  )
}

export const SettingsTable = (props:TSettingsTable) => {
  const {
    group
  } = props

  const {
    keys,
    width,
    items
  } = useMemo(() => {
    return Object.entries(group.settings)
      .reduce((acc, [key, value]) => {
        if(!acc.keys?.length){
          acc.keys = Object.keys(value).filter(key => !hiddenKeys.includes(key))
          acc.width = Math.round(12 / acc.keys.length)
        }

        acc.items.push(value)

        return acc
      }, { keys: [] as string[], items: [] as TSetting[], width: true as number|boolean })
  }, [])


  return (
    <Box>
      <SettingsListHeader width={width} group={group} keys={keys} items={items} />
      <SettingsListBody width={width} group={group} keys={keys} items={items} />
    </Box>
  )
}