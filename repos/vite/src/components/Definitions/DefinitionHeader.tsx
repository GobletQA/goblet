import type { DefinitionTabs } from '@constants'
import type { SyntheticEvent } from 'react'

import { DefsHeaderTabs, DefsHeaderTab } from './Definitions.styled'

export type TDefinitionsProps = {
  active: number
  tabs: typeof DefinitionTabs
  onChange:(event: SyntheticEvent, value: number) => any
}

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    [`aria-controls`]: `full-width-tabpanel-${index}`,
  };
}

export const DefinitionHeader = (props:TDefinitionsProps) => {
  const {
    active,
    tabs,
    onChange
  } = props

  return (
    <DefsHeaderTabs
      value={active}
      textColor="inherit"
      variant="fullWidth"
      onChange={onChange}
      indicatorColor="secondary"
      className='goblet-defs-header-tabs'
      aria-label="Feature Definition Tabs"
    >
      {tabs.map(tab => {
        return (
          <DefsHeaderTab
            label={tab.name}
            {...a11yProps(tab.id)}
            key={tab.key || tab.id}
          />
        )
      })}
    </DefsHeaderTabs>
  )
}