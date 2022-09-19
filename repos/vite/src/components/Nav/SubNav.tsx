import Box from '@mui/material/Box'
import { dims } from '@theme'
import Typography from '@mui/material/Typography'

export type TSubNavProps = {
  open?: boolean
  activeNav?: string | undefined
}

const SubNavContent = (props:TSubNavProps) => {
  const {
    activeNav
  } = props

  return (
    <Typography component="p" >
      {activeNav} - sub-nav
    </Typography>
  )
  
}

const NoActiveNav = () => {
  return (
    <Box sx={{ padding: `20px` }} >
      <Typography component="p" sx={{ textAlign: 'center', width: '100%' }} >
        Please select a navigation item
      </Typography>
    </Box>
  )
}

export const SubNav = (props:TSubNavProps) => {
  const {
    open,
    activeNav
  } = props

  return (
    <Box
      sx={{
        width: `100%`,
        position: `absolute`,
        top: dims.header.height,
        left: dims.nav.closedWidth,
        height: `calc( 100% - ${dims.header.height}px )`,
        maxWidth: dims.nav.openWidth - dims.nav.closedWidth,
      }}
    >
      {activeNav ? (<SubNavContent {...props} />) : (<NoActiveNav />)}
    </Box>
  )
}