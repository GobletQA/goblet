import type { TSettingGroupMeta } from '@types'
import type { SyntheticEvent, ComponentProps } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

export type TSettingTabs = ComponentProps<typeof Tabs> & {
  value:number,
  groups: TSettingGroupMeta[]
  onChange:(event: SyntheticEvent, newValue: number) => void
}

const styles = {
  tabs: { borderRight: 1, borderColor: 'divider' }
}

export const SettingTabs = (props:TSettingTabs) => {
  const { groups, ...rest } = props

  return (
    <Tabs
      sx={styles.tabs}
      visibleScrollbar
      variant="scrollable"
      orientation="vertical"
      className='settings-tabs'
      aria-label="Goblet Settings"
      {...rest}
    >
    {groups?.length
      && groups.map(group => {
          return (
            <Tab
              label={group.name}
              id={`vertical-tab-${group.idx}`}
              key={`${group.idx}-${group.name}`}
              aria-controls={`vertical-tabpanel-${group.idx}`}
              className={`settings-tab settings-tab-${group.name}`}
            />
          )
        })
    }
    </Tabs>
  )
}