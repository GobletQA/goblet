import { useCallback, MouseEvent } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'


type TTabProps = {
  tab: string
  menu?: boolean
  onTabClick?: (...args:any[]) => any
  onCloseTab?: (...args:any[]) => any
}

type TTabsProps = {
  tabs: string[]
  anchorEl: null | HTMLElement
  onOpenNav?: (...args:any[]) => any
  onTabClick?: (...args:any[]) => any
  onCloseTab?: (...args:any[]) => any
}

const Tab = (props:TTabProps) => {

  const {
    tab,
    menu,
    onTabClick,
    onCloseTab
  } = props

  const onClick = useCallback((event:MouseEvent) => {
    onTabClick?.(event, tab)
    onCloseTab?.(event, tab)
  }, [tab, onTabClick, onCloseTab])


  return menu
    ? (
        <MenuItem onClick={onClick}>
          <Typography textAlign="center">{tab}</Typography>
        </MenuItem>
      )
    : (
        <Button
          key={tab}
          onClick={onClick}
          sx={{ my: 2, color: 'white', display: 'block' }}
        >
          {tab}
        </Button>
      )
}

const MobileTabs = (props:TTabsProps) => {
  const {
    tabs,
    anchorEl,
    onTabClick,
    onOpenNav,
    onCloseTab
  } = props

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onOpenNav}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={onCloseTab}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            menu
            key={tab}
            tab={tab}
            onTabClick={onTabClick}
            onCloseTab={onCloseTab}
          />
        ))}
      </Menu>
    </Box>
  )
}


export const Tabs = (props:TTabsProps) => {

  const {
    tabs,
    onTabClick,
    onCloseTab
  } = props

  return (
    <>
      <MobileTabs {...props} />
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            tab={tab}
            onTabClick={onTabClick}
            onCloseTab={onCloseTab}
          />
        ))}
      </Box>
    </>
  )
}