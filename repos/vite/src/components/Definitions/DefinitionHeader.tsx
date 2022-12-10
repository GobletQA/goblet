import type { ReactNode, CSSProperties, SyntheticEvent } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'


export type TDefinitionsProps = {
  sx?: CSSProperties
  value: number
  onChange:(event: SyntheticEvent, value: number) => any
}

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export const DefinitionHeader = (props:TDefinitionsProps) => {
  const {
    sx,
    value,
    onChange
  } = props

  return (
    <Tabs
      sx={sx}
      value={value}
      textColor="inherit"
      variant="fullWidth"
      onChange={onChange}
      indicatorColor="secondary"
      className='goblet-defs-header'
      aria-label="full width tabs example"
    >
      <Tab label="Default Steps" {...a11yProps(0)} />
      <Tab label="Custom Steps" {...a11yProps(1)} />
    </Tabs>
  )
}