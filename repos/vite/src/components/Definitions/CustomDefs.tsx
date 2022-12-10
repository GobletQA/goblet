import type { DefinitionTabs } from '@constants'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DefTabPanel } from './Definitions.styled'

export type TCustomDefs = {
  index:number
  tab:typeof DefinitionTabs[0]
}

export const CustomDefs = (props:TCustomDefs) => {
  const { tab, index, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography>
          List Custom Defs Here
        </Typography>
      </Box>
    </DefTabPanel>
  );
}