import type { ReactNode, CSSProperties, SyntheticEvent } from 'react'
import type { DefinitionTabs } from '@constants'

import Box from '@mui/material/Box'
import { CustomDefs } from './CustomDefs'
import { DefaultDefs } from './DefaultDefs'

const TabComps = [DefaultDefs, CustomDefs]

export type TDefinitionsBody = {
  sx?:CSSProperties
  active:number
  tabs: typeof DefinitionTabs
  onChange:(event: SyntheticEvent, value: number) => any
}


export const DefinitionBody = (props:TDefinitionsBody) => {
  const {
    sx,
    tabs,
    active,
  } = props

  const idx = active | 0
  const Component = TabComps[idx]

  return (
    <Box className='goblet-defs-body' sx={sx} >
      <Component tab={tabs[active]} index={idx} />
    </Box>
  )

}