import type { DefinitionTabs } from '@constants'
import type { SyntheticEvent, MouseEvent } from 'react'

import { Tooltip } from '@gobletqa/components'
import { DefsHeaderTabs, DefsHeaderTab } from './Definitions.styled'


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
  icon: {
    width: `20px`,
    height: `20px`,
    fontSize: `20px`,
    marginRight: `5px`,
    marginBottom: `0px !important`,
  }
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
      className='gb-defs-header-tabs'
      aria-label="Feature Definition Tabs"
    >
      {tabs.map(tab => {
        const { Icon, id, name } = tab

        return (
          <Tooltip
            key={id || name}
            title={`Show list of ${name.toLowerCase()}`}
          >
            <DefsHeaderTab
              icon={<Icon sx={styles.icon} />}
              label={name}
              onClick={onTabClick}
              {...a11yProps(id)}
              className={`gb-defs-tab-${name}`}
            />
          </Tooltip>
        )
      })}
    </DefsHeaderTabs>
  )
}