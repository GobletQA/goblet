import Button from '@mui/material/Button'
import type { ComponentProps } from 'react'
import { LogoutIcon } from '@components/Icons'
import { signOutReload } from '@actions/admin/user/signOutReload'

export type TLogoutButton = ComponentProps<typeof Button> & {

}

export const LogoutButton = (props:TLogoutButton) => {
  return (
    <Button
      variant='outlined'
      color='secondary'
      onClick={signOutReload}
      startIcon={<LogoutIcon />}
    >
      Sign Out
    </Button>
  )
}