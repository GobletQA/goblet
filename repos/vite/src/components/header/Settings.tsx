import type { TSettingNavItem, TAnyCB } from '@types'

import { useUser } from '@store'
import { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Menu } from './Header.styled'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { Tooltip } from '@gobletqa/components'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { dims } from '@gobletqa/components/theme'
import { Link as RouterLink } from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {
  SettingsContainer
} from './Settings.styled'

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

const style = {
  width: `${dims.header.avatar.size}px`,
  height: `${dims.header.avatar.size}px`,
}

const getUserInitials = (displayName?:string, username?:string) => {
  if(!displayName && !username) return {}
  
  if(displayName){
    const split = displayName.split(` `)
    const first = split.shift() || ``
    const last = split.pop() || ``
    return { children: `${first[0] || ''}${last[0] || ''}`.trim().toUpperCase() }
  }
  if(username)
    return { children: `${username[0]}${username[1]}`.trim().toUpperCase()}
}

const useAvatar = () => {
  const user = useUser()
  return useMemo(() => {
    return user.photoUrl
      ? {
          sx: style,
          src: user.photoUrl,
          alt: user.displayName || user.username || `User Name`,
        }
      : {
          sx: style,
          alt: user.displayName || user.username || `User Name`,
          ...getUserInitials(user.displayName, user.username),
        }
  }, [user.photoUrl, user.displayName, user.username])
  
}

export const Settings = (props:TSettings) => {
  const { onOpenSettings } = props
  const avatarProps = useAvatar()

  return (
    <SettingsContainer>
      <Tooltip title="Admin Settings">
        <IconButton onClick={onOpenSettings} sx={{ p: 0 }}>
          <Avatar {...avatarProps} />
        </IconButton>
      </Tooltip>
      <SettingMenu {...props} />
    </SettingsContainer>
  )
}