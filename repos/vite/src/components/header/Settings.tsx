import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

type TSettingsCB = (...args:any[]) => any

type TSettingsProps = {
  anchorEl: null | HTMLElement
  onOpenSettings: TSettingsCB
  onCloseSettings: TSettingsCB
  settings: string[]
}

export const Settings = (props:TSettingsProps) => {
  const {
    anchorEl,
    settings,
    onOpenSettings,
    onCloseSettings,
  } = props

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={onOpenSettings} sx={{ p: 0 }}>
          <Avatar alt="User Name" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
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
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={onCloseSettings}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}