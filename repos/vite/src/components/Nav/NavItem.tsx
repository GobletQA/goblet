import type { ElementType } from 'react'

import { dims } from '@theme'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

export type TNavItemProps = {
  title: string
  open?: boolean
  index?: number
  group?: string
  last?: boolean
  first?: boolean
  divider?: boolean | 'bottom' | 'top'
  Icon?: ElementType
}

const NavIcon = (props:TNavItemProps) => {

  const {
    title,
    Icon,
    open
  } = props

  return Icon && (
    <Box>
      <ListItemIcon
        sx={{
          mr: 'auto',
          minWidth: 0,
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Icon width="24px" />
        <Typography
          component="span"
          sx={{
            fontSize: '12px',
          }}
        >
          {title}
        </Typography>
      </ListItemIcon>
    </Box>
  ) || null
}


export const NavItem = (props:TNavItemProps) => {
  const {
    title,
    Icon,
    open
  } = props

  return (
    <ListItem
      disablePadding
      sx={{
        width: dims.nav.closedWidth
      }}
    >
      <ListItemButton
        sx={{
          px: 2.5,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
      {Icon
        ? (<NavIcon {...props} />)
        : (<ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />)
      }
      </ListItemButton>
    </ListItem>
  )
}
