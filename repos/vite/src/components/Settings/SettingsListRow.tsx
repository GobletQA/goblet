import type { ReactNode } from 'react'
import Grid from '@mui/material/Unstable_Grid2'

export type TSettingsListItem = {
  className?:string
  children: ReactNode
}

export const SettingsListRow = (props:TSettingsListItem) => {

  const {
    children,
    className,
  } = props
  
  return (
    <Grid
      xs={12}
      display='flex'
      sx={{
        maxHeight: `60px`,
        paddingTop: `5px`,
        alignItems: `center`,
        paddingBottom: `6px`,
        marginBottom: `-3px`,
      }}
      className={`settings-list-row ${className || ''}`.trim()}
    >
      {children}
    </Grid>
  )
  
}
