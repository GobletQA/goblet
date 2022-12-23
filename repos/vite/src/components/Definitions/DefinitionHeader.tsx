import type { DefinitionTabs } from '@constants'
import type { SyntheticEvent, MouseEvent } from 'react'

import { Tooltip } from '@components/Tooltip'
import { DefsHeaderTabs, DefsHeaderTab } from './Definitions.styled'
import { AppsIcon, LabelImportantIcon, FunctionsIcon } from '@components/Icons'

const tabIcons = {
  default: LabelImportantIcon,
  custom: FunctionsIcon,
  all: AppsIcon,
}

export type TDefinitionsProps = {
  active: number
  tabs: typeof DefinitionTabs
  onChange:(event: SyntheticEvent, value: number) => any
  onTabClick:(event:MouseEvent<HTMLDivElement>) => void
}

export type TDefHeaderTab = {
  tab: typeof DefinitionTabs[0]
  onTabClick:(event:MouseEvent<HTMLDivElement>) => void
}

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    [`aria-controls`]: `full-width-tabpanel-${index}`,
  };
}

const styles = {
  icon: { marginBottom: `0px !important`, marginRight: `5px` }
}

export const DefinitionHeader = (props:TDefinitionsProps) => {
  const {
    tabs,
    active,
    onChange,
    onTabClick
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
        const Icon = tabIcons[tab.icon as keyof typeof tabIcons]
        
        return (
          <Tooltip title={`Show list of ${tab.name.toLowerCase()}`} >
            <DefsHeaderTab
              icon={<Icon sx={styles.icon} />}
              label={tab.name}
              onClick={onTabClick}
              {...a11yProps(tab.id)}
              key={tab.id || tab.name}
              className={`goblet-defs-tab-${tab.name}`}
            />
          </Tooltip>
        )
      })}
    </DefsHeaderTabs>
  )
}