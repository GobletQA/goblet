import type { TWorldGroupMeta } from '@GBR/types'
import type { SyntheticEvent, ComponentProps } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'


export type TWorldTabs = ComponentProps<typeof Tabs> & {
  value:number,
  groups: TWorldGroupMeta[]
  onChange:(event: SyntheticEvent, newValue: number) => void
}

const styles = {
  tabs: { borderRight: 1, borderColor: 'divider' }
}

export const WorldTabs = (props:TWorldTabs) => {
  const { groups, ...rest } = props

  return (
    <Tabs
      sx={styles.tabs}
      visibleScrollbar
      variant="scrollable"
      orientation="vertical"
      className='world-tabs'
      aria-label="World Editor"
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
              className={`world-tab world-tab-${group.name}`}
            />
          )
        })
    }
    </Tabs>
  )
}