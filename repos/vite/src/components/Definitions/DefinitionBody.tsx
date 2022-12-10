import type { ReactNode, CSSProperties, SyntheticEvent } from 'react'

import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { DefinitionHeader } from './DefinitionHeader'


export type TDefinitionsBody = {
  sx?:CSSProperties
  value:number
  onChange:(event: SyntheticEvent, value: number) => any
}

export type TabPanel = {
  value: number
  index: number
  children?: ReactNode
}


const TabPanel = (props: TabPanel) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export const DefinitionBody = (props:TDefinitionsBody) => {
  const {
    sx,
    value
  } = props

  return (
    <Box className='goblet-defs-body' sx={sx} >
      <TabPanel value={value} index={0}>
        Default Steps
      </TabPanel>
      <TabPanel value={value} index={1}>
        Custom Steps
      </TabPanel>
    </Box>
  )

}