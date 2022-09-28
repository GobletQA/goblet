import type { ElementType } from 'react'
import { useMemo } from 'react'
import { dims } from '@theme'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@mui/material/styles'
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
  color?: string
  activeNav?: string
  isActive?: boolean
  divider?: boolean | 'bottom' | 'top'
  Icon?: ElementType
}

const NavIcon = (props:TNavItemProps) => {

  const {
    title,
    Icon,
    open,
    color,
    isActive,
  } = props

  return Icon && (
    <Box>
      <ListItemIcon
        sx={{
          color,
          mr: 'auto',
          minWidth: 0,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Icon width="24px" />
        <Typography
          component="span"
          sx={{
            color,
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
    open,
    activeNav
  } = props

  const theme = useTheme()

  const cleaned = useMemo(() => (title || ``).replace(/\s_-\//gim, ``).toLowerCase(), [title])

  const {
    isActive,
    color,
    backgroundColor
  } = useMemo(() => {
    const isActive = cleaned === activeNav

    return {
      isActive,
      backgroundColor: isActive ? theme.palette.action.focus : `transparent`,
      color: isActive ? theme.palette.primary.main : theme.palette.action.active,
    }
  }, [cleaned, activeNav, theme])

  return (
    <ListItem
      data-nav-item={cleaned}
      className={`nav-list-item nav-item-${cleaned}`}
      disablePadding
      sx={{
        backgroundColor,
        width: dims.nav.closedWidth
      }}
    >
      <ListItemButton
        data-nav-item={cleaned}
        className={`nav-item-button nav-item-button-${cleaned}`}
        sx={{
          px: 2.5,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
      {Icon
        ? (<NavIcon {...props} isActive={isActive} color={color} />)
        : (
            <ListItemText
              primary={title}
              data-nav-item={cleaned}
              sx={{ color, opacity: open ? 1 : 0 }}
            />
          )
      }
      </ListItemButton>
    </ListItem>
  )
}
