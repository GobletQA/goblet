import type { ElementType } from 'react'

import { dims } from '@theme'
import { useMemo } from 'react'
import { NavIcon } from './NavIcon'
import { Tooltip } from '@components/Tooltip'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@hooks/theme/useTheme'
import { getColor } from '@utils/theme/getColor'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'

export type TNavItemProps = {
  title: string
  tooltip: string
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

export const NavItem = (props:TNavItemProps) => {
  const {
    title,
    Icon,
    open,
    tooltip,
    activeNav
  } = props

  const theme = useTheme()

  const cleaned = useMemo(() => (title || ``).replace(/\s_-\//gim, ``).toLowerCase(), [title])

  const {
    color,
    isActive,
    hoverBgColor,
    backgroundColor
  } = useMemo(() => {

    const isActive = cleaned === activeNav
    const activeColor = getColor(`colors.fadeDark60`, `colors.fadeDark60`, theme)
    const inactiveColor = getColor(`colors.fadeDark50`, `colors.fadeDark50`, theme)
    const backgroundActiveColor = getColor(`colors.fadeDark15`, `colors.fadeDark15`, theme)

    return {
      isActive,
      hoverBgColor: backgroundActiveColor,
      color: isActive ? activeColor : inactiveColor,
      backgroundColor: isActive ? backgroundActiveColor : `transparent`,
    }
  }, [cleaned, activeNav, theme])


  return (
    <ListItem
      data-nav-item={cleaned}
      className={`nav-list-item nav-item-${cleaned}`}
      disablePadding
      sx={{
        bgcolor: backgroundColor,
        width: dims.nav.closedWidth,

        ['& .MuiListItemButton-root:hover']: {
          bgcolor: hoverBgColor,
          '&, & .MuiListItemIcon-root': {
            
          },
        },
      }}
    >
      <Tooltip title={tooltip || title} loc='right' >
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
          ? (<NavIcon {...props} color={color} />)
          : (
              <ListItemText
                primary={title}
                data-nav-item={cleaned}
                sx={{ color, opacity: open ? 1 : 0 }}
              />
            )
        }
        </ListItemButton>
      </Tooltip>
    </ListItem>
  )
}
