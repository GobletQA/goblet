import type { CSSProps } from '@types'
import type { ElementType } from 'react'

import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'

export type TNavIcon = {
  sx?:CSSProps
  color?: string
  Icon?: ElementType
  width?:string|number
}

export const NavIcon = (props:TNavIcon) => {
  const { sx, width=`24`, Icon, color } = props

  return Icon && (
    <Box>
      <ListItemIcon
        sx={[{
          color,
          mr: 'auto',
          minWidth: 0,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }, sx] as CSSProps}
      >
        <Icon width={`${width}px`} />
      </ListItemIcon>
    </Box>
  ) || null
}
