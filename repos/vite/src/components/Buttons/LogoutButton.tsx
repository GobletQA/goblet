import Button from '@mui/material/Button'
import type { ComponentProps } from 'react'
import { LogoutIcon } from '@gobletqa/components'
import { signOutManually } from '@actions/admin/user/signOutManually'

export type TLogoutButton = ComponentProps<typeof Button> & {

}

export const LogoutButton = (props:TLogoutButton) => {
  return (
    <Button
      variant='outlined'
      color='secondary'
      startIcon={<LogoutIcon />}
      onClick={() => signOutManually()}
    >
      Sign Out
    </Button>
  )
}