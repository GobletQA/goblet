import type { TSettingNavItem, TAnyCB } from '@types'
import { useCallback } from 'react'
import { dims } from '@theme'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Menu } from './Header.styled'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

type TSettings = {
  anchorEl: null | HTMLElement
  onOpenSettings: TAnyCB
  onCloseSettings: TAnyCB
  settings: TSettingNavItem[]
}

type TSettingItem = TSettingNavItem & {
  onClose?: TAnyCB
}

const SettingItem = (props:TSettingItem) => {
  const {
    Icon,
    path,
    divider,
    label,
    onClick,
    onClose,
    iconProps,
    itemProps,
    textProps,
    linkProps
  } = props

  const onMenuClose = useCallback((...args:any[]) => {
    onClick?.(...args)
    onClose?.(...args)
  }, [onClose])

  return (
    <>
      {divider && (<Divider />)}
      <MenuItem onClick={onMenuClose} autoFocus {...itemProps} >
        <ListItemIcon>
          <Icon fontSize="small" {...iconProps} />
        </ListItemIcon>
        <ListItemText>
          { onClick ? (
            <Typography {...textProps} >{label}</Typography>
          ) : (
            <Link
              underline='none'
              component={RouterLink}
              to={`/${(path || label || ``).toLowerCase()}`}
              {...linkProps}
            >
              <Typography {...textProps} >{label}</Typography>
            </Link>
          )}
        </ListItemText>
      </MenuItem>
    </>
  )
}

const SettingMenu = (props:TSettings) => {
  const {
    anchorEl,
    settings,
    onCloseSettings,
  } = props

  return (
    <Menu
      elevation={0}
      sx={{ mt: '6px' }}
      id="gb-account-menu"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={onCloseSettings}
    >
      {settings.map((setting) => {
        return (
          <SettingItem
            onClose={onCloseSettings}
            key={setting.label || setting.path}
            {...setting}
          />
        )
      })}
    </Menu>
  )
}


export const Settings = (props:TSettings) => {
  const { onOpenSettings } = props

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Admin Settings">
          <IconButton onClick={onOpenSettings} sx={{ p: 0 }}>
            <Avatar
              alt="User Name"
              sx={{
                width: `${dims.header.avatar.size}px`,
                height: `${dims.header.avatar.size}px`,
              }}
            />
          </IconButton>
        </Tooltip>
        <SettingMenu {...props} />
      </Box>
    </>
  )
}