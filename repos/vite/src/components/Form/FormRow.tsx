import type { ComponentProps } from 'react'
import Grid from '@mui/material/Unstable_Grid2'

export type TFormRow = ComponentProps<typeof Grid> & {
  
}

export const FormRow = (props:TFormRow) => {
  const {
     ...rest
  } = props


  return (
    <Grid container spacing={1} {...rest} >
      <Grid xs={8}>
        
      </Grid>
      <Grid xs={4}>
        
      </Grid>
      <Grid xs={4}>
        
      </Grid>
      <Grid xs={8}>
        
      </Grid>
    </Grid>
  )

} 