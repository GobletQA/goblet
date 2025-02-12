import type { TNavItem } from '@types'

import { useMemo } from 'react'
import { NavIcon } from './NavIcon'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import {
  dims,
  colors,
  Tooltip,
  useTheme,
  getColor,
} from '@gobletqa/components'

export type TNavItemProps = TNavItem & {
  open?: boolean
  index?: number
  group?: string
  last?: boolean
  first?: boolean
  color?: string
  activeNav?: string
  isActive?: boolean
  divider?: boolean | `bottom` | `top`
}

export const NavItem = (props:TNavItemProps) => {
  const {
    Icon,
    open,
    name,
    title,
    tooltip,
    activeNav
  } = props

  const theme = useTheme()

  const {
    color,
    hoverBgColor,
    backgroundColor
  } = useMemo(() => {

    const isActive = name === activeNav
    const activeColor = getColor(colors.fadeDark60, colors.fadeDark60, theme)
    const inactiveColor = getColor(colors.fadeDark50, colors.fadeDark50, theme)
    const backgroundActiveColor = getColor(colors.fadeDark15, colors.fadeDark15, theme)

    return {
      isActive,
      hoverBgColor: backgroundActiveColor,
      color: isActive ? activeColor : inactiveColor,
      backgroundColor: isActive ? backgroundActiveColor : `transparent`,
    }
  }, [name, activeNav, theme])


  return (
    <ListItem
      disablePadding
      data-nav-item={name}
      className={`nav-list-item nav-item-${name}`}
      sx={{
        bgcolor: backgroundColor,
        width: dims.nav.closedWidth,

        [`& .MuiListItemButton-root:hover`]: {
          bgcolor: hoverBgColor,
          [`&, & .MuiListItemIcon-root`]: {
            
          },
        },
      }}
    >
      <Tooltip title={tooltip || title} loc='right' >
        <ListItemButton
          data-nav-item={name}
          className={`nav-item-button nav-item-button-${name}`}
          sx={{
            px: 2.5,
            minHeight: 48,
            justifyContent: 'center',
          }}
        >
        {Icon
          ? (<NavIcon {...props} color={color} />)
          : (
              <ListItemText
                primary={title}
                data-nav-item={name}
                sx={{ color, opacity: open ? 1 : 0 }}
              />
            )
        }
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}
