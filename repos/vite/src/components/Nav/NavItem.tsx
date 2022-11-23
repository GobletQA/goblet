import type { ElementType } from 'react'

import { useMemo } from 'react'
import { dims } from '@theme'
import Box from '@mui/material/Box'
import { Tooltip } from '@components/Tooltip'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@hooks/theme/useTheme'
import { getColor } from '@utils/theme/getColor'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
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

const NavIconText = (props:TNavItemProps) => {
  const {
    title,
    color,
  } = props

  return (
    <Typography
      component="span"
      sx={{
        color,
        fontSize: '12px',
      }}
    >
      {title}
    </Typography>
  )
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
      </ListItemIcon>
    </Box>
  ) || null
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
    isActive,
    color,
    backgroundColor
  } = useMemo(() => {
    const isActive = cleaned === activeNav
    
    // TODO: clean up the side-nav icon colors
    // Need to fix on hover and active when in dark mode
    const activeColor = getColor(`colors.fadeDark60`, `colors.fadeDark60`, theme)
    const inactiveColor = getColor(`colors.fadeDark50`, `colors.fadeDark50`, theme)
    const backgroundActiveColor = getColor(`colors.fadeDark15`, `colors.fadeDark15`, theme)

    // const activeColor = getColor(`colors.white00`, `colors.fadeDark60`, theme)
    // const inactiveColor = getColor(`colors.fadeLight30`, `colors.fadeDark50`, theme)
    // const backgroundActiveColor = getColor(`colors.fadeLight10`, `colors.fadeDark15`, theme)

    return {
      isActive,
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
        backgroundColor,
        width: dims.nav.closedWidth
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
      </Tooltip>
    </ListItem>
  )
}
